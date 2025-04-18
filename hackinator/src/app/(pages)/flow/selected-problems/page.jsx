'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SelectedIdeasPage() {
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  useEffect(() => {
    const ideas = JSON.parse(localStorage.getItem('selectedIdeas') || '[]');
    setSelectedIdeas(ideas);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className=" p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-8 text-white">THIS IS USER ALL SELECTED IDEAS</h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {selectedIdeas.map((idea, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-300 h-40 flex flex-col justify-center"
          >
            <h2 className="text-lg font-semibold mb-2">{idea.title}</h2>
            <p className="text-sm text-gray-700">{idea.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
