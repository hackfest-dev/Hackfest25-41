import { useState } from 'react';

export default function Hackinator() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="relative min-h-screen p-6 bg-gray-50">
      {/* Top Navigation */}
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

      {/* Features */}
      <div className="text-center mt-16">
        <h2 className="text-4xl font-bold mb-8 text-indigo-800 tracking-wide">FEATURES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {['Pitch only', 'Readme Only', 'Discussion only', 'Idea only'].map((item, idx) => (
            <div
              key={idx}
              className="border border-indigo-300 p-8 rounded-lg text-sm bg-white shadow hover:shadow-lg transition cursor-pointer"
              title={item}
            >
              <div className="font-semibold text-indigo-700">{item}</div>
              <div className="mt-3 text-xs text-gray-500">TEXT</div>
            </div>
          ))}
        </div>
      </div>

      {/* GO WITH FLOW Button */}
      <div className="flex justify-center mt-16">
        <button
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => setShowOverlay(false)}
          className="border border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition text-lg font-semibold"
          aria-label="Go with flow"
        >
          GO WITH FLOW
        </button>
      </div>

      {/* Fullscreen Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 bg-white bg-opacity-95 flex justify-center items-center p-8 overflow-auto"
          onMouseEnter={() => setShowOverlay(true)}  // Keep the overlay visible on hover
          onMouseLeave={() => setShowOverlay(false)}  // Hide the overlay when mouse leaves
          role="dialog"
          aria-modal="true"
          aria-labelledby="overlay-title"
        >
          <div className="border border-indigo-400 p-10 max-w-4xl w-full rounded-lg shadow-lg bg-white flex flex-col items-center">
            <h3
              id="overlay-title"
              className="text-2xl font-extrabold mb-8 text-center text-indigo-800 tracking-wide"
            >
              Hackinator
            </h3>

            <div className="flex flex-col items-center w-full">
              <div className="mb-6">
                <div className="text-xl font-bold text-purple-600">Idea Select Helper</div>
                <div className="text-lg text-blue-600">(we should ask this for user optimization)</div>
              </div>

              <div className="border border-indigo-300 p-8 w-full max-w-md rounded-lg bg-indigo-50 text-sm shadow-inner mb-6">
                <div className="text-xl font-bold text-indigo-700">Form</div>
                <ul className="list-disc list-inside text-xs text-indigo-900">
                  <li>Discussions</li>
                  <li>README Generation</li>
                  <li>Pitch Helping</li>
                </ul>
                <div className="text-red-600 mt-4">This step user can skip</div>
              </div>

              <div className="text-lg font-bold text-green-700 mt-6">Thank You for using Hackinator!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
