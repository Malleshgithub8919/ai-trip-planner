import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TravelPlanShowcase = () => {
  let plan = null;
  try {
    plan = JSON.parse(localStorage.getItem('travelPlan'));
    console.log('Travel plan data:', plan);
    console.log('Itinerary data:', plan?.itinerary);
  } catch (e) {
    console.error('Error parsing travel plan:', e);
    plan = null;
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Travel Plan Found</h1>
          <p className="text-gray-600 mb-8">Please generate a trip first to see your travel plan.</p>
          <Link
            to="/create-trip"
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Create New Trip
          </Link>
        </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='font-bold text-3xl mb-2'>Your AI Travel Plan ✨</h2>
          <p className='text-gray-600 text-xl mb-8'>Here's your personalized travel itinerary</p>
        </motion.div>

        {/* Trip Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌍</span>
            <h3 className="text-2xl font-bold text-gray-800">Trip Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📍</div>
              <div className="font-semibold text-gray-800">Destination</div>
              <div className="text-gray-600">{plan.destination}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold text-gray-800">Duration</div>
              <div className="text-gray-600">{plan.duration}</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold text-gray-800">Budget</div>
              <div className="text-gray-600">{plan.budget}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-gray-800">Travelers</div>
              <div className="text-gray-600">{plan.travelers}</div>
            </div>
          </div>
        </motion.div>

        {/* Best Time to Visit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌤️</span>
            <h3 className="text-2xl font-bold text-gray-800">Best Time to Visit</h3>
          </div>
          <p className="text-gray-700 text-lg">{plan.bestTimeToVisit}</p>
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🗓️</span>
            <h3 className="text-2xl font-bold text-gray-800">Your Itinerary</h3>
          </div>
          
          <div className="space-y-6">
            {plan.itinerary?.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="border-l-4 border-blue-500 pl-6"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Day {day.day || index + 1}
                </h4>
                <div className="space-y-4">
                  {day.activities?.map((activity, activityIndex) => (
                    <div key={activityIndex} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">
                          {activity.time === 'morning' ? '🌅' : 
                           activity.time === 'afternoon' ? '☀️' : '🌙'}
                        </span>
                        <span className="font-semibold text-gray-800 capitalize">{activity.time}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{activity.activity}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📍 {activity.location}</span>
                        <span>💰 {activity.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            {(!plan.itinerary || plan.itinerary.length === 0) && (
              <div className="text-center text-gray-600 py-8">
                <p>No itinerary data available for this trip.</p>
                <p className="text-sm mt-2">Please generate a new trip to see the full itinerary.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Accommodation & Transportation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accommodation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏨</span>
              <h3 className="text-2xl font-bold text-gray-800">Accommodation</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-gray-800 mb-1">Recommendations:</div>
                <ul className="text-gray-700">
                  {plan.accommodation?.recommendations?.map((rec, index) => (
                    <li key={index} className="mb-1">• {rec}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Price Range:</div>
                <div className="text-gray-700">{plan.accommodation?.priceRange}</div>
              </div>
            </div>
          </motion.div>

          {/* Transportation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚇</span>
              <h3 className="text-2xl font-bold text-gray-800">Transportation</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-gray-800">Local Transport:</div>
                <div className="text-gray-700">{plan.transportation?.local}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Estimated Cost:</div>
                <div className="text-gray-700">{plan.transportation?.estimated_cost}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Total Cost */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💳</span>
            <h3 className="text-2xl font-bold text-white">Total Estimated Cost</h3>
          </div>
          <div className="text-3xl font-bold text-white">{plan.totalEstimatedCost}</div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Link
            to="/create-trip"
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Create New Trip
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Print Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelPlanShowcase;
