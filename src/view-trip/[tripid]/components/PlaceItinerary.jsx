import React, { useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaDollarSign, FaCamera } from 'react-icons/fa';

function PlaceItinerary({ trip }) {
  const [selectedDay, setSelectedDay] = useState(1);
  
  if (!trip?.tripData?.itinerary) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">🗓️</div>
        <h2 className="font-bold text-2xl text-gray-800 mb-2">Daily Itinerary</h2>
        <p className="text-gray-500">No itinerary data available for this trip</p>
      </div>
    );
  }

  const itinerary = trip.tripData.itinerary;
  const totalDays = trip.tripData.totalDays || itinerary.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <span className="text-2xl">🗓️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Daily Itinerary</h2>
            <p className="text-indigo-100">Explore your day-by-day adventure</p>
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalDays }, (_, index) => index + 1).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Content */}
      <div className="p-6">
        {itinerary.map((dayPlan, index) => {
          if (dayPlan.day !== selectedDay) return null;
          
          return (
            <div key={index}>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                  {dayPlan.day}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Day {dayPlan.day}</h3>
                  <p className="text-gray-600">
                    {dayPlan.plan?.length || 0} activities planned
                  </p>
                </div>
              </div>
              
              {dayPlan.plan && dayPlan.plan.length > 0 ? (
                <div className="space-y-6">
                  {dayPlan.plan.map((place, placeIndex) => (
                    <div key={placeIndex} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Place Header */}
                      <div className="p-6 pb-4">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Image Section */}
                          {place.placeImageUrl && (
                            <div className="lg:w-1/3">
                              <div className="relative group">
                                <img 
                                  src={place.placeImageUrl || "/placeholder.jpg"} 
                                  alt={place.placeName}
                                  className="w-full h-48 lg:h-56 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                                  onError={(e) => {
                                    e.target.src = "/placeholder.jpg";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg"></div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                                  <FaCamera className="w-4 h-4 text-gray-600" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Content Section */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800 mb-2">{place.placeName}</h4>
                              <p className="text-gray-600 leading-relaxed">{place.placeDetails}</p>
                            </div>
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {place.timeTravel && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                  <FaClock className="text-blue-600 w-5 h-5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium text-blue-800">Duration</div>
                                    <div className="text-blue-600">{place.timeTravel}</div>
                                  </div>
                                </div>
                              )}
                              
                              {place.ticketPricing && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                  <FaDollarSign className="text-green-600 w-5 h-5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium text-green-800">Cost</div>
                                    <div className="text-green-600 font-semibold">{place.ticketPricing}</div>
                                  </div>
                                </div>
                              )}
                              
                              {place.geoCoordinates && (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                  <FaMapMarkerAlt className="text-purple-600 w-5 h-5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium text-purple-800">Location</div>
                                    <button 
                                      onClick={() => {
                                        const lat = place.geoCoordinates.lat;
                                        const lng = place.geoCoordinates.lng;
                                        window.open(`https://maps.google.com?q=${lat},${lng}`, '_blank');
                                      }}
                                      className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors"
                                    >
                                      View on Map
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏖️</div>
                  <p className="text-xl text-gray-500">Free day - No activities planned</p>
                  <p className="text-gray-400">Perfect time to relax or explore on your own!</p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* If no plan found for selected day */}
        {!itinerary.find(day => day.day === selectedDay) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No itinerary available</h3>
            <p className="text-gray-500">Day {selectedDay} hasn't been planned yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceItinerary;
