import { useState } from 'react';
import { motion } from 'framer-motion';
import Thankyou from '../../ThankYouPath/Tahnkyou';

export default function FuturisticReadme() {
  const [isHovering, setIsHovering] = useState(false);
  const [promptText, setPromptText] = useState('');
  
  return (
    <div className="flex items-center justify-center p-6">
      <Thankyou/>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-[850px] md:w-70 mx-auto" // 70% width and centered
      >
        {/* Main content container */}
        <div className="rounded-lg overflow-hidden shadow-2xl bg-gray-800 border border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-800 p-3 border-b border-gray-700">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 font-mono ml-2">README.md</span>
            </motion.div>
            
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-600 text-xs text-white rounded"
              >
                COPY
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#0ea5e9" }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-500 text-xs text-white rounded"
              >
                DOWNLOAD
              </motion.button>
            </div>
          </div>
          
          {/* Content area */}
          <motion.div 
            className="h-96 p-6 bg-gray-900 relative overflow-hidden"
            whileHover={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute inset-0 bg-grid-pattern opacity-5"
            ></motion.div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center h-full"
            >
              <motion.p 
                className="text-center font-mono"
                animate={{ 
                  color: isHovering ? 
                    ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f59e0b'] : 
                    '#f59e0b',
                  textShadow: isHovering ? 
                    ['0 0 8px rgba(245,158,11,0.6)', '0 0 12px rgba(239,68,68,0.6)', '0 0 8px rgba(139,92,246,0.6)', '0 0 12px rgba(6,182,212,0.6)', '0 0 8px rgba(245,158,11,0.6)'] : 
                    '0 0 8px rgba(245,158,11,0.6)',
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                this is the file done by AI in backend
              </motion.p>
            </motion.div>
            
            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: 0.1
                  }}
                  animate={{ 
                    y: [
                      Math.random() * 100 + '%', 
                      Math.random() * 100 + '%'
                    ],
                    x: [
                      Math.random() * 100 + '%', 
                      Math.random() * 100 + '%'
                    ],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{ 
                    duration: 10 + Math.random() * 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Input area */}
          <div className="p-4 bg-gray-800 flex items-center space-x-2">
            <motion.input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="ENTER THE PROMPT"
              className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            
            <motion.button 
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-bold text-sm"
              whileHover={{ 
                scale: 1.05,
                backgroundImage: "linear-gradient(to right, #4f46e5, #2563eb)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              GO!!!
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}