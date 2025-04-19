'use client';

import {
  LightBulbIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hackinator() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const modalRef = useRef(null);
  const router = useRouter();

  const features = [
    { title: 'Pitch only', icon: LightBulbIcon, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', pageLink: '/pitch' },
    { title: 'Readme Only', icon: DocumentTextIcon, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', pageLink: '/readme' },
    { title: 'Discussion only', icon: ChatBubbleLeftRightIcon, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', pageLink: '/discussion' },
    { title: 'Idea only', icon: EyeIcon, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', pageLink: '/ideas' },
    { title: 'Go With Flow', icon: RocketLaunchIcon, videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', pageLink: '/flow' },
  ];

  const handleCardClick = (feature) => {
    setModalContent(feature);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  const navigateToPage = () => {
    if (modalContent) {
      router.push(modalContent.pageLink);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  // Framer Motion variants
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(6px)', transition: { duration: 0.4 } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 200,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: { duration: 0.2 },
    },
  };

  const contentFade = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.3 } },
  };

  return (
    <div className="relative h-auto p-6 flex flex-col justify-center">
      {/* Animated Modal */}
      <AnimatePresence>
        {modalOpen && modalContent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              ref={modalRef}
              className="bg-white p-6 rounded-2xl shadow-xl max-w-xl w-full text-center flex flex-col relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>

              <motion.div className="p-6 mb-4" variants={contentFade} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">{modalContent.title}</h3>
                <p className="text-gray-600 mb-4">
                  Here are the instructions for {modalContent.title}. You can follow along with the video to learn more!
                </p>
              </motion.div>

              <motion.div className="p-6 justify-center" variants={contentFade} initial="hidden" animate="visible">
                <iframe
                  width="480"
                  height="255"
                  src={modalContent.videoUrl}
                  title="Tutorial Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="mx-auto"
                ></iframe>
              </motion.div>

              <motion.button
                onClick={navigateToPage}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mt-4"
                variants={contentFade}
                initial="hidden"
                animate="visible"
              >
                Go to {modalContent.title} Page
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Cards */}
      <div className="text-center mt-12">
        <h2 className="text-5xl font-extrabold mb-12 text-indigo-800 tracking-wide">FEATURES</h2>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {features.slice(0, 3).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="border bg-slate-200 border-indigo-300 p-8 rounded-xl text-base shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center w-72"
                onClick={() => handleCardClick(feature)}
              >
                <Icon className="h-14 w-14 text-indigo-500 mb-4" />
                <div className="font-semibold text-indigo-700 text-xl mb-2">{feature.title}</div>
                <div className="text-sm text-gray-600 mb-6 text-center max-w-xs">
                  A short description or tutorial teaser.
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {features.slice(3).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="border bg-slate-200 border-indigo-300 p-8 rounded-xl text-base shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center w-72"
                onClick={() => handleCardClick(feature)}
              >
                <Icon className="h-14 w-14 text-indigo-500 mb-4" />
                <div className="font-semibold text-indigo-700 text-xl mb-2">{feature.title}</div>
                <div className="text-sm text-gray-600 mb-6 text-center max-w-xs">
                  A short description or tutorial teaser.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
