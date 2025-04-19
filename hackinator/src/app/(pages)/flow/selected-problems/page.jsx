'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectedIdeasPage() {
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

  const handleIdeaClick = (idea) => {
    const topicQuery = encodeURIComponent(JSON.stringify(idea));
    router.push(`/flow/discussion-page?topic=${topicQuery}`);
  };

  return (
    <motion.div
      className=" p-6 flex flex-col items-center justify-start rounded-2xl bg-slate-950/40 backdrop-blur-lg text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
       User's Selected Ideas
      </motion.h1>

      <AnimatePresence>
        {selectedIdeas.length === 1 ? (
          <motion.div
            key={0}
            onClick={() => handleIdeaClick(selectedIdeas[0])}
            className="w-full max-w-md cursor-pointer rounded-2xl p-6 border border-white/10 backdrop-blur-md bg-white/5 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-white text-center">
              {selectedIdeas[0].title}
            </h2>
            <p className="text-sm text-gray-300 text-center">
              {selectedIdeas[0].description}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.4,
                  when: 'beforeChildren',
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {selectedIdeas.map((idea, index) => (
              <motion.div
                key={index}
                onClick={() => handleIdeaClick(idea)}
                className="cursor-pointer rounded-2xl p-6 h-44 flex flex-col justify-center border border-white/5 backdrop-blur-md bg-white/5 shadow-xl"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-xl font-semibold mb-2 text-white">{idea.title}</h2>
                <p className="text-sm text-gray-300">{idea.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
