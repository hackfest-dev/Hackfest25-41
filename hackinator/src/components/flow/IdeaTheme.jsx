'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function IdeaTheme() {
  const searchParams = useSearchParams();
  const themesParam = searchParams.get('themes');
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    if (themesParam) {
      try {
        const parsed = JSON.parse(themesParam);
        setThemes(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Invalid themes format", err);
      }
    }
  }, [themesParam]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hackinator</h1>
          <p className="text-xl text-gray-600">IDEA GENERATOR</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
          {themes.map((theme, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-gray-700 font-medium">{theme}</span>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <p className="text-red-500 font-medium text-center">
            CHECK THE THEME IF IT IS CORRECTED
          </p>
          <div className="border-b border-gray-300"></div>
          <div className="text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              SUBMIT SELECTED THEMES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
