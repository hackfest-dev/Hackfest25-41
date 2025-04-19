'use client'
import React, { useEffect, useState } from 'react';


export default function IdeaSelectorOnly() {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Idea Select Helper</h1>

      {/* Ideas Container */}
      <div className="w-full max-w-2xl space-y-6">
        {[
          { id: 1, text: "AI-powered fitness coach app", status: "loaded" },
          { id: 2, text: "VR-based virtual travel platform", status: "loading" },
          { id: 3, text: "Blockchain-based voting system", status: "loaded" },
          { id: 4, text: "Smart waste sorting assistant", status: "loaded" },
          { id: 5, text: "Augmented reality shopping assistant", status: "loaded" },
        ].map((idea) => (
          <div key={idea.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            {idea.status === "loading" ? (
              <div className="animate-pulse mb-4">
                <p className="text-gray-600">Loading idea details...</p>
              </div>
            ) : (
              <p className="text-gray-800 mb-4">{idea.text}</p>
            )}
            
            <div className="flex gap-4 justify-end">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                Accept
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GOO!! Message */}
      <div className="mt-12 text-4xl font-bold text-purple-600 animate-bounce">
        GOO!! 🎉
      </div>
    </div>
  );
}
