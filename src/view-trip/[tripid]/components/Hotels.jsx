import React from 'react'

function Hotels({ trip }) {
  return (
    <div>
        <h2 className='font-bold text-xl mt-5'>Recommended Hotels</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {trip?.tripData?.hotels?.map((hotel, index) => (
                <div key={index} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
                    <img src="/placeholder.jpg" className="w-full h-48 object-cover rounded-lg" />
                    <div className='my-2 flex flex-col gap-2'>
                        <h2 className='font-medium text-lg'>{hotel?.Name}</h2>
                        <h2 className='text-xs text-gray-500'>{hotel?.address}</h2>
                        <h2 className='text-sm text-green-600'>{hotel?.price}</h2>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Hotels