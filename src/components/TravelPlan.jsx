
import React from 'react';

const TravelPlan = ({ plan }) => {
  if (!plan) return <div>No travel plan found.</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Travel Plan for {plan.destination}</h2>
      <div className="mb-2"><span className="font-semibold">Duration:</span> {plan.duration}</div>
      <div className="mb-2"><span className="font-semibold">Budget:</span> {plan.budget}</div>
      <div className="mb-2"><span className="font-semibold">Travelers:</span> {plan.travelers}</div>
      <div className="mb-2"><span className="font-semibold">Best Time to Visit:</span> {plan.bestTimeToVisit}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Itinerary</h3>
      {plan.itinerary?.map((day, i) => (
        <div key={i} className="mb-4">
          <div className="font-semibold">Day {day.day}</div>
          <ul className="list-disc ml-6">
            {day.activities?.map((activity, j) => (
              <li key={j} className="mb-1">
                <span className="font-semibold">{activity.time}:</span> {activity.activity} <br />
                <span className="text-gray-600">Location:</span> {activity.location} <br />
                <span className="text-gray-600">Cost:</span> {activity.cost}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h3 className="text-xl font-semibold mt-6 mb-2">Accommodation</h3>
      <div className="mb-2"><span className="font-semibold">Recommendations:</span> {plan.accommodation?.recommendations?.join(', ')}</div>
      <div className="mb-2"><span className="font-semibold">Price Range:</span> {plan.accommodation?.priceRange}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Transportation</h3>
      <div className="mb-2"><span className="font-semibold">Local:</span> {plan.transportation?.local}</div>
      <div className="mb-2"><span className="font-semibold">Estimated Cost:</span> {plan.transportation?.estimated_cost}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Total Estimated Cost</h3>
      <div className="mb-2">{plan.totalEstimatedCost}</div>
    </div>
  );
};

export default TravelPlan;
