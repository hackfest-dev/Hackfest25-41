import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ReadmeFilee() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10">
      {/* Background blur for the full screen */}
      <div className="absolute inset-0 z-0 backdrop-blur-sm" />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* File Container */}
        <div className="mb-6 w-full max-w-xl">
          <div className="w-[750px] h-[450px] border-2 border-black rounded-xl shadow-xl backdrop-blur-md bg-white/60">
            <div className="flex justify-between items-center border-b-2 border-black px-4 py-3">
              <span className="font-bold text-base">README.md</span>
              <div className="flex space-x-2">
                <button className="border-2 border-black px-3 py-1 text-xs font-bold rounded hover:scale-105 transition-transform">
                  COPY
                </button>
                <button className="border-2 border-black px-3 py-1 text-xs font-bold rounded hover:scale-105 transition-transform">
                  DOWNLOAD
                </button>
              </div>
            </div>
            <div className="h-full flex items-center justify-center text-center px-6 font-medium text-base">
              this is the file done by ai in backend
            </div>
          </div>
        </div>

        {/* Enhanced Animated Prompt Section */}
        <motion.div
          className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', type: 'spring' }}
        >
          {/* Floating label input style */}
          <motion.div
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/10 rounded-lg p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input
              type="text"
              id="prompt"
              className="flex-1 outline-none font-mono text-sm px-2 bg-transparent placeholder:text-[#ffffff] placeholder:italic text-[#ffffff]"
              placeholder="Enter the prompt..."
            />
          </motion.div>

          {/* Animated button */}
          <button
            className="flex items-center gap-1 px-4 py-2 bg-[#ffffff] text-black rounded-md font-mono text-sm hover:bg-[#f0f0f0] active:scale-95 transition-transform"
          >
            Go
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
