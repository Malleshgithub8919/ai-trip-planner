import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-extrabold text-5xl md:text-6xl text-gray-900 mb-6">
          Discover your next adventure with AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Personalized itineraries at your fingertips
        </p>
        <Link to={'/create-trip'}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors">
            Get started, it's Free
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
