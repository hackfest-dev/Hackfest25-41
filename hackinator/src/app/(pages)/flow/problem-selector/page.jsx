import React from 'react'

export default function ProblemSelector() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <h1 className="text-3xl font-bold mb-8 text-gray-800">Idea Select helper</h1>
    
    <div className="flex gap-4 mb-8">
      {/* Loading Button */}
      <button 
        className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
        disabled
      >
        Loading
      </button>
      
      {/* Accept Button */}
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
        Accept
      </button>
      
      {/* Reject Button */}
      <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
        Reject
      </button>
    </div>

    <div className="text-4xl font-bold text-gray-800">
      GOO!!
    </div>
  </div>
  )
}
