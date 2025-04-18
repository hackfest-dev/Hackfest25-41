import React from 'react'

export default function IdeaTheme() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
  <div className="mx-auto max-w-3xl">
    {/* Title Section */}
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Hackinator</h1>
      <p className="text-xl text-gray-600">IDEA GENERATOR</p>
    </div>

    {/* Checklist Section */}
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
      <div className="flex items-center space-x-4">
        <input 
          type="checkbox" 
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">blame name</span>
      </div>
      <div className="flex items-center space-x-4">
        <input 
          type="checkbox" 
          checked
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">blame name</span>
      </div>
      <div className="flex items-center space-x-4">
        <input 
          type="checkbox" 
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700 font-medium">blame name</span>
      </div>
    </div>

    {/* Theme Section */}
    <div className="space-y-8">
      <p className="text-red-500 font-medium text-center">
        CHECK THE THEME IF IT IS CORRECTED
      </p>
      <div className="border-b border-gray-300"></div>
      
      {/* Add Theme Button */}
      <div className="text-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
          ADD THEME
        </button>
      </div>
    </div>
  </div>
</div>
  )
}
