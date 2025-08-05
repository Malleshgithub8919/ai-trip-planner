import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosSend, IoMdCalendar, IoMdPeople } from "react-icons/io";
import { FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";

function InfoSection({ trip }) {
  const handleImageError = (e) => {
    e.target.src = '/placeholder.jpg';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Trip to ${trip.userSelection?.destination?.location?.label}`,
        text: `Check out my ${trip.userSelection?.noOfDays} day trip plan!`,
        url: window.location.href
      });
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      alert('Trip link copied to clipboard!');
    }
  };

  const tripLocation = trip.userSelection?.destination?.location?.label || trip.tripData?.location || 'Trip Destination';
  const tripDays = trip.userSelection?.noOfDays || trip.tripData?.totalDays;
  const tripBudget = trip.userSelection?.budget || trip.tripData?.budget;
  const tripTraveler = trip.userSelection?.traveler || trip.tripData?.traveler;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-lg border border-blue-200">
      {/* Hero Image Section */}
      <div className="relative">
        <img 
          src={trip?.tripData?.imageUrl || '/placeholder.jpg'} 
          alt={`Trip to ${tripLocation}`}
          className="w-full h-72 md:h-96 object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Floating Share Button */}
        <div className="absolute top-4 right-4">
          <Button 
            onClick={handleShare}
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            size="sm"
          >
            <IoIosSend className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Trip Title */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <FaMapMarkerAlt className="text-blue-600 w-5 h-5" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Destination</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {tripLocation}
            </h1>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="flex items-center justify-center mb-2">
                <IoMdCalendar className="text-blue-500 w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{tripDays}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaMoneyBillWave className="text-green-500 w-6 h-6" />
              </div>
              <div className="text-lg font-bold text-gray-900 capitalize">{tripBudget}</div>
              <div className="text-sm text-gray-600">Budget</div>
            </div>

            {/* Travelers */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="flex items-center justify-center mb-2">
                <IoMdPeople className="text-purple-500 w-6 h-6" />
              </div>
              <div className="text-lg font-bold text-gray-900 capitalize">{tripTraveler}</div>
              <div className="text-sm text-gray-600">Traveler(s)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors duration-200"
            >
              <IoIosSend className="w-4 h-4 mr-2" />
              Share This Trip
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-xl transition-colors duration-200"
            >
              🖨️ Print Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;