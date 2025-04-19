'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ProblemSelector() {
  const router = useRouter();
  const [ideas, setIdeas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionStatus, setSelectionStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAnimating = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MTA3ODcyLCJpYXQiOjE3NDUxMDQyNzIsImp0aSI6IjliYWZjMjAyNmFkNjRhMGM4ZmJjNjA5OTg3ZmUxYzg1IiwidXNlcl9pZCI6Mn0.PHN5odgydL2MgvxxRNLTY5S-_a9AGJT1kK7MF3DG5oQ';

        const response = await axios.post(
          'http://127.0.0.1:8000/api/ideas/27/generate/',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ideasData = Array.isArray(response.data) ? response.data : [];
        setIdeas(ideasData);
        setSelectionStatus(Array(ideasData.length).fill(null));
      } catch (error) {
        console.error('Error fetching ideas:', error);
        toast.error('Failed to fetch ideas');
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const findNextAvailableIndex = useCallback((startIndex, statusArray) => {
    let nextIndex = startIndex;
    let attempts = 0;
    do {
      nextIndex = (nextIndex + 1) % ideas.length;
      attempts++;
    } while (statusArray[nextIndex] !== null && attempts < ideas.length);
    return statusArray[nextIndex] === null ? nextIndex : -1;
  }, [ideas]);

  const handleSwipe = useCallback(
    (direction) => {
      setSelectionStatus((prevStatus) => {
        const updatedStatus = [...prevStatus];
        if (direction === 'accepted') {
          const acceptedCount = updatedStatus.filter((s) => s === 'accepted').length;
          if (acceptedCount >= 6) {
            toast.error('You can only select up to 6 ideas!', {
              position: 'top-center',
              autoClose: 3000,
            });
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
    },
    [currentIndex, findNextAvailableIndex]
  );

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

  const handleGooo = () => {
    const selectedIdeas = ideas
      .map((idea, index) => (selectionStatus[index] === 'accepted' ? idea : null))
      .filter(Boolean);

    const encodedIdeas = encodeURIComponent(JSON.stringify(selectedIdeas));
    router.push(`/flow/selected-problems?ideas=${encodedIdeas}`);
  };

  const acceptedCount = selectionStatus.filter((status) => status === 'accepted').length;
  const currentIdea = currentIndex !== -1 ? ideas[currentIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-lg px-4 py-8 text-white">
      {loading ? (
        <div className="text-xl font-bold text-white/70">Loading Problems statments...</div>
      ) : (
        <>
          <div className="relative w-20 h-20 mb-6">
            <svg className="transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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
                  Swipe → Accept | Swipe ← Reject
                  <br />
                  (or use arrow keys)
                </div>
              </motion.div>
            ) : (
              <div className="absolute w-full h-full flex items-center justify-center text-center">
                No more ideas to review. Proceed with selected ideas.
              </div>
            )}
          </div>

          <div className="flex space-x-2 overflow-x-auto mb-6 max-w-[90vw] px-2">
            {Array.isArray(ideas) &&
              ideas.map((idea, i) =>
                selectionStatus[i] === 'accepted' ? (
                  <div
                    key={idea.id || i}
                    className="bg-white/10 border border-white/10 rounded-md px-3 py-2 text-xs text-white text-center backdrop-blur-md shadow-md"
                  >
                    {idea.title}
                  </div>
                ) : null
              )}
          </div>

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
        </>
      )}
    </div>
  );
}
