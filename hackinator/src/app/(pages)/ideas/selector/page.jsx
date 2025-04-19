'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Thankyou from '../../../../components/ThankYouPath/Tahnkyou';

export default function SelectedIdeasPageOnly() {
  const searchParams = useSearchParams();
  const router = useRouter();
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


  // New layout configuration
  const getLayoutConfig = (length) => {
    if (length === 1) return 'single';
    if (length === 2) return 'double';
    return 'grid';
  };

  const layoutType = getLayoutConfig(selectedIdeas.length);

  return (
    <motion.div
      className="p-6 flex flex-col items-center shadow-2xl rounded-2xl bg-slate-900/30 backdrop-blur-lg text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
    <Thankyou />
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Selected Problems Statemant 
      </motion.h1>

        <div className="flex-grow flex items-center justify-center w-full">
            <AnimatePresence>
            {layoutType === 'single' ? (
                <motion.div
                key="single"
                className="cursor-pointer rounded-2xl p-6 w-full max-w-md border border-white/10 backdrop-blur-md bg-white/5 shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                >
                <h2 className="text-2xl font-semibold mb-2 text-white text-center">
                    {selectedIdeas[0].title}
                </h2>
                <p className="text-sm text-gray-300 text-center">
                    {selectedIdeas[0].description}
                </p>
                </motion.div>
            ) : layoutType === 'double' ? (
                <motion.div
                key="double"
                className="flex flex-col md:flex-row gap-6 justify-center items-center w-full px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.15 }}
                >
                {selectedIdeas.map((idea, index) => (
                    <motion.div
                    key={index}
                    className="cursor-pointer rounded-2xl p-6 w-full max-w-md h-44 flex flex-col justify-center border border-white/5 backdrop-blur-md bg-white/5 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    >
                    <h2 className="text-xl font-semibold mb-2 text-white">{idea.title}</h2>
                    <p className="text-sm text-gray-300">{idea.description}</p>
                    </motion.div>
                ))}
                </motion.div>
            ) : (
                <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.15,
                        when: "beforeChildren"
                    }
                    }
                }}
                >
                {selectedIdeas.map((idea, index) => (
                    <motion.div
                    key={index}
                    className="cursor-pointer rounded-2xl p-6 h-44 flex flex-col justify-center border border-white/5 backdrop-blur-md bg-white/5 shadow-xl"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    >
                    <h2 className="text-xl font-semibold mb-2 text-white">{idea.title}</h2>
                    <p className="text-sm text-gray-300">{idea.description}</p>
                    </motion.div>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    </motion.div>
  );
}