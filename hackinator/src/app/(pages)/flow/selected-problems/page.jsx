'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SelectedIdeasPage() {
  const searchParams = useSearchParams();
  const [selectedIdeas, setSelectedIdeas] = useState([]);

  useEffect(() => {
    const ideasParam = searchParams.get('ideas');
    if (ideasParam) {
      try {
        const ideas = JSON.parse(decodeURIComponent(ideasParam));
        setSelectedIdeas(ideas);
      } catch (e) {
        console.error('Failed to parse ideas:', e);
      }
    }
  }, [searchParams]);

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="p-6 flex flex-col items-center"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-10 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        🎯 User's Selected Ideas
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
        layout
      >
        {selectedIdeas.map((idea, index) => (
          <motion.div
            key={index}
            className="rounded-2xl p-6 h-44 flex flex-col justify-center 
                       border border-white/10 backdrop-blur-md 
                       shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
                       transition-all cursor-pointer"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              rotateX: 2,
              rotateY: -2,
              boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            layout
          >
            <h2 className="text-xl font-semibold mb-2 text-white">{idea.title}</h2>
            <p className="text-sm text-gray-300">{idea.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
