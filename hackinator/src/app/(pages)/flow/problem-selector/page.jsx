'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Dummy ideas array with IDs
const dummyIdeas = [
  { id: 1, title: 'Productivity Tracker', description: 'An app to track your daily tasks and measure productivity trends over time.' },
  { id: 2, title: 'Recipe Sharing Platform', description: 'A place for users to share and discover new recipes with social features.' },
  { id: 3, title: 'Language Learning Chatbot', description: 'A chatbot that helps users practice conversation in different languages.' },
  { id: 4, title: 'Minimal Habit Tracker', description: 'A simple and clean app to build and track daily habits effectively.' },
  { id: 5, title: 'abc', description: 'A community-driven site where users review and rate books they have read.' },
  { id: 6, title: 'Book Review Website', description: 'A community-driven site where users review and rate books they have read.' },
  { id: 7, title: 'Productivity Tracker', description: 'An app to track your daily tasks and measure productivity trends over time.' },
  { id: 8, title: 'Recipe Sharing Platform', description: 'A place for users to share and discover new recipes with social features.' },
  { id: 9, title: 'Language Learning Chatbot', description: 'A chatbot that helps users practice conversation in different languages.' },
  { id: 10, title: 'Minimal Habit Tracker', description: 'A simple and clean app to build and track daily habits effectively.' },
  { id: 11, title: 'abc', description: 'A community-driven site where users review and rate books they have read.' },
  { id: 12, title: 'Book Review Website', description: 'A community-driven site where users review and rate books they have read.' }
];

export default function ProblemSelector() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionStatus, setSelectionStatus] = useState(Array(dummyIdeas.length).fill(null));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dummyIdeas.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + dummyIdeas.length) % dummyIdeas.length);
  };

  const handleAccept = () => {
    const acceptedCount = selectionStatus.filter((status) => status === 'accepted').length;
    if (acceptedCount >= 6) {
      toast.error('You can only select up to 6 ideas!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    const updatedStatus = [...selectionStatus];
    updatedStatus[currentIndex] = 'accepted';
    setSelectionStatus(updatedStatus);
    setCurrentIndex((prev) => (prev + 1) % dummyIdeas.length);
  };

  const handleReject = () => {
    const updatedStatus = [...selectionStatus];
    updatedStatus[currentIndex] = null;
    setSelectionStatus(updatedStatus);
    setCurrentIndex((prev) => (prev - 1 + dummyIdeas.length) % dummyIdeas.length);
  };

  const handleGooo = () => {
    const selectedIdeas = dummyIdeas
      .map((idea, index) => (selectionStatus[index] === 'accepted' ? idea : null))
      .filter(Boolean);

    localStorage.setItem('selectedIdeas', JSON.stringify(selectedIdeas));
    router.push('/flow/selected-problems');
  };

  const idea = dummyIdeas[currentIndex];
  const currentStatus = selectionStatus[currentIndex];
  const acceptedCount = selectionStatus.filter(status => status === 'accepted').length;

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-fade-in" style={{ color: '#f5f5f5' }}>
      <div className="w-full max-w-2xl text-center bg-opacity-20 text-white border border-gray-300 rounded-md p-4 mb-8 shadow">
        <h1 className="text-xl font-semibold">Idea Select Helper</h1>
      </div>

      <div className="text-white mb-6">
        <p>{`${acceptedCount}/6 ideas selected`}</p>
        <div className="w-full bg-gray-300 h-2 rounded-full">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${(acceptedCount / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={handlePrev}
          className="text-2xl bg-white bg-opacity-20 text-white rounded-full w-12 h-12 flex items-center justify-center border border-white hover:bg-opacity-30 transition"
        >
          &lt;
        </button>

        <div className="w-96 h-96 bg-white bg-opacity-10 backdrop-blur-md border border-gray-400 rounded-md flex flex-col justify-between p-4 shadow-lg text-white">
          <div className="flex-grow flex flex-col items-center justify-center text-center px-2">
            <h2 className="text-xl font-bold mb-2">{idea.title}</h2>
            <p className="text-sm text-white text-opacity-90">{idea.description}</p>
          </div>

          <div className="flex justify-center mt-6">
            {currentStatus === 'accepted' ? (
              <button
                onClick={handleReject}
                className="bg-red-500 bg-opacity-40 text-red-100 px-6 py-2 rounded-md hover:bg-opacity-30 transition"
              >
                Reject
              </button>
            ) : (
              <button
                onClick={handleAccept}
                className="bg-green-500 bg-opacity-40 text-green-100 px-6 py-2 rounded-md hover:bg-opacity-30 transition"
              >
                Accept
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="text-2xl bg-white bg-opacity-20 text-white rounded-full w-12 h-12 flex items-center justify-center border border-white hover:bg-opacity-30 transition"
        >
          &gt;
        </button>
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGooo}
          className="relative inline-flex items-center justify-center px-10 py-3 mt-6 font-semibold text-white rounded-2xl shadow-xl overflow-hidden group bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 transition-all duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></span>
          <span className="relative flex items-center gap-2 z-10">
            <span>Gooo!!</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8V4z" />
            </motion.svg>
          </span>
        </motion.button>
      </div>
    </div>
  );
}