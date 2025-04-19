'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const dummyIdeas = [
  { id: 1, title: 'Productivity Tracker', description: 'Track daily tasks and measure productivity.' },
  { id: 2, title: 'Recipe Sharing Platform', description: 'Share and discover new recipes with social features.' },
  { id: 3, title: 'Language Learning Chatbot', description: 'Practice conversations in different languages.' },
  { id: 4, title: 'Minimal Habit Tracker', description: 'Build and track daily habits.' },
  { id: 5, title: 'abc', description: 'Review and rate books in a community-driven site.' },
  { id: 6, title: 'Book Review Website', description: 'Find and discuss books with fellow readers.' },
];

export default function ProblemSelOnly() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionStatus, setSelectionStatus] = useState(Array(dummyIdeas.length).fill(null));
  const isAnimating = useRef(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const findNextAvailableIndex = useCallback((startIndex, statusArray) => {
    let nextIndex = startIndex;
    let attempts = 0;
    do {
      nextIndex = (nextIndex + 1) % dummyIdeas.length;
      attempts++;
    } while (statusArray[nextIndex] !== null && attempts < dummyIdeas.length);
    return statusArray[nextIndex] === null ? nextIndex : -1;
  }, []);

  const handleSwipe = useCallback((direction) => {
    setSelectionStatus(prevStatus => {
      const updatedStatus = [...prevStatus];
      if (direction === 'accepted') {
        const acceptedCount = updatedStatus.filter(s => s === 'accepted').length;
        if (acceptedCount >= 6) {
          toast.error('You can only select up to 6 ideas!', { position: 'top-center', autoClose: 3000 });
          return prevStatus;
        }
        updatedStatus[currentIndex] = 'accepted';
      } else {
        updatedStatus[currentIndex] = 'rejected';
      }

      const nextIndex = findNextAvailableIndex(currentIndex, updatedStatus);
      setCurrentIndex(nextIndex !== -1 ? nextIndex : -1);
      return updatedStatus;
    });
  }, [currentIndex, findNextAvailableIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === -1 || isAnimating.current) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        isAnimating.current = true;
        animate(x, 200, { duration: 0.3 }).then(() => {
          handleSwipe('accepted');
          x.set(0);
          isAnimating.current = false;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        isAnimating.current = true;
        animate(x, -200, { duration: 0.3 }).then(() => {
          handleSwipe('rejected');
          x.set(0);
          isAnimating.current = false;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, x, handleSwipe]);

  // Rest of the component remains the same...
  const handleGooo = () => {
    const selectedIdeas = dummyIdeas
      .map((idea, index) => (selectionStatus[index] === 'accepted' ? idea : null))
      .filter(Boolean);

    const encodedIdeas = encodeURIComponent(JSON.stringify(selectedIdeas));
    router.push(`/ideas/selector?ideas=${encodedIdeas}`);
  };

  const acceptedCount = selectionStatus.filter((status) => status === 'accepted').length;
  const currentIdea = currentIndex !== -1 ? dummyIdeas[currentIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-lg px-4 py-8 text-white">
      {/* Circular progress */}
      <div className="relative w-20 h-20 mb-6">
        <svg className="transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />
          <motion.path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - (acceptedCount / 6) * 100}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {acceptedCount}/6
        </div>
      </div>

      {/* Swipable Idea Card */}
      <div className="relative w-[22rem] h-[22rem] mb-8">
        {currentIdea ? (
          <motion.div
            key={currentIdea.id}
            className={`absolute w-full h-full backdrop-blur-md border rounded-xl p-6 text-white flex flex-col justify-between shadow-2xl ${
              selectionStatus[currentIndex] === 'accepted' ? 'bg-green-500/50' : 'bg-white/10'
            }`}
            drag="x"
            style={{ x, rotate }}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe('accepted');
              else if (info.offset.x < -100) handleSwipe('rejected');
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-xl font-bold">{currentIdea.title}</h2>
              <p className="text-sm text-white/80">{currentIdea.description}</p>
            </div>
            <div className="text-center text-xs text-white/60">
              Swipe → Accept | Swipe ← Reject<br />
              (or use arrow keys)
            </div>
          </motion.div>
        ) : (
          <div className="absolute w-full h-full flex items-center justify-center text-center">
            No more ideas to review. Proceed with selected ideas.
          </div>
        )}
      </div>

      {/* Mini Carousel of Accepted Ideas */}
      <div className="flex space-x-2 overflow-x-auto mb-6 max-w-[90vw] px-2">
        {dummyIdeas.map((idea, i) =>
          selectionStatus[i] === 'accepted' ? (
            <div
              key={idea.id}
              className="bg-white/10 border border-white/10 rounded-md px-3 py-2 text-xs text-white text-center backdrop-blur-md shadow-md"
            >
              {idea.title}
            </div>
          ) : null
        )}
      </div>

      {/* Gooo Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGooo}
        disabled={acceptedCount === 0}
        className={`px-6 py-3 rounded-xl text-white font-semibold transition-all ${
          acceptedCount > 0
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        Gooo!!
      </motion.button>
    </div>
  );
}