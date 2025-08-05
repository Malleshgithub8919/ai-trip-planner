import React from 'react'
import { FaStar, FaMapMarkerAlt, FaDollarSign, FaWifi, FaCar } from 'react-icons/fa'

function Hotels({ trip }) {
  if (!trip?.tripData?.hotels || trip.tripData.hotels.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h2 className='font-bold text-2xl text-gray-800 mb-2'>Recommended Hotels</h2>
        <p className="text-gray-500">No hotel recommendations available for this trip</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <span className="text-2xl">🏨</span>
          </div>
          <div>
            <h2 className='text-2xl font-bold'>Recommended Hotels</h2>
            <p className="text-emerald-100">Perfect places to stay during your trip</p>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className='p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {trip.tripData.hotels.map((hotel, index) => (
                <div key={index} className='bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    {/* Hotel Image */}
                    <div className="relative">
                        <img 
                            src={hotel?.imageUrl || "/placeholder.jpg"} 
                            alt={hotel?.Name || 'Hotel'}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        
                        {/* Rating Badge */}
                        {hotel?.rating && (
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <FaStar className="text-yellow-400 w-3 h-3" />
                                <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
                            </div>
                        )}
                    </div>

                    {/* Hotel Content */}
                    <div className='p-5 space-y-4'>
                        {/* Hotel Name */}
                        <h3 className='font-bold text-lg text-gray-800 leading-tight'>{hotel?.Name}</h3>
                        
                        {/* Address */}
                        {hotel?.address && (
                            <div className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-gray-400 w-4 h-4 mt-1 flex-shrink-0" />
                                <p className='text-sm text-gray-600 leading-relaxed'>{hotel.address}</p>
                            </div>
                        )}

                        {/* Price */}
                        {hotel?.price && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                <FaDollarSign className="text-green-600 w-4 h-4" />
                                <span className='text-lg font-bold text-green-700'>{hotel.price}</span>
                                <span className="text-sm text-green-600">per night</span>
                            </div>
                        )}

                        {/* Description */}
                        {hotel?.description && (
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {hotel.description}
                            </p>
                        )}

                        {/* Amenities (if available) */}
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <FaWifi className="w-3 h-3" />
                                WiFi
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <FaCar className="w-3 h-3" />
                                Parking
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            {hotel?.geoCoordinates && (
                                <button 
                                    onClick={() => {
                                        const lat = hotel.geoCoordinates.lat;
                                        const lng = hotel.geoCoordinates.lng;
                                        window.open(`https://maps.google.com?q=${lat},${lng}`, '_blank');
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <FaMapMarkerAlt className="w-3 h-3" />
                                    View on Map
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    const query = encodeURIComponent(`${hotel?.Name} ${hotel?.address || ''}`);
                                    window.open(`https://www.google.com/search?q=${query}`, '_blank');
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Hotels