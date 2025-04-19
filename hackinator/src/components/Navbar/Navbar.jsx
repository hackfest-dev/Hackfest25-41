'use client'; // Required for using hooks in App Router

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on discussion page
  if (pathname === '/flow/discusion-page') {
    return null;
  }

  return (
    <div>
      {/* Top Navigation */}
      <div className="flex justify-between items-center border-b border-gray-300 p-4 bg-transparent bg-blur-md shadow-md sticky z-30">
        <div className="text-3xl font-extrabold text-indigo-700">Hackinator</div>
        <div className="space-x-3">
          <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition">
            Get Ideas
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