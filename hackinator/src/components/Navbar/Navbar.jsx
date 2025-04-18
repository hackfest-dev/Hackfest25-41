import React from 'react'

export default function Navbar() {
  return (
    <div>
              {/* {/* Top Navigation */}
      <div className="flex justify-between items-center border-b border-gray-300 p-4 bg-white shadow-md sticky top-0 z-30">
        <div className="text-3xl font-extrabold text-indigo-700">Hackinator</div>
        <div className="space-x-3">
          <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition">
            Get Idea
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition">
            Something
          </button>
          <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition">
            PROFILE
          </button>
        </div>
      </div>
    </div>
  )
}
