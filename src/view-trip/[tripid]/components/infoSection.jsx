import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
function InfoSection({ trip }) {
  const handleImageError = (e) => {
    e.target.src = '/placeholder.jpg';
  };

  return (
    <div>
        <img 
          src='/placeholder.jpg' 
          alt='trip image' 
          className="w-full h-64 object-cover rounded-lg"
          onError={handleImageError}
        />
        <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip.userSelection?.destination?.location?.label}</h2>
          <div className='flex gap-5'><h2 className='p-1 px-3 bg-gray-200 rounded-full text-black-500 text-xs md:text-md'>📅{trip.userSelection?.noOfDays} days</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-black-500 text-xs md:text-md'>💰{trip.userSelection?.budget} budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-black-500 text-xs md:text-md'>🍻No.of traveler{trip.userSelection?.traveler} </h2>
          </div>
        </div>
        <Button><IoIosSend /></Button>
        </div>
    </div>
  )
}

export default InfoSection