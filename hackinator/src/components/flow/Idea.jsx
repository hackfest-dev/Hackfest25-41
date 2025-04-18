'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function IdeaFlow() {
  const [idea, setIdea] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleIdeaChange = (e) => setIdea(e.target.value);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!idea || !file) {
        toast.error('Please explain your idea and upload a file.');
      return;
    }
    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate file upload
      setLoading(false);
      toast.success("Idea and file uploaded successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        style: {
          backgroundColor: '#0f0c29', // Deep violet/navy for success
          color: '#f5f5f5', // Soft white for text
          fontSize: '16px',
          padding: '12px',
          borderRadius: '8px',
        },
        progressStyle: {
          backgroundColor: '#302b63', // Rich indigo for progress bar
        },
      });
    } catch (error) {
      setLoading(false);
      const errorText = error.message || 'There was an error uploading your idea and file.';
      toast.error(errorText); // Show error toast
      setErrorMessage(errorText); // Set the error message
    }
  };  

  // Variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start px-4 py-10 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg" variants={itemVariants}>
        Hackinator
      </motion.h1>

      <motion.p className="mt-12 text-xl font-bold mb-2 drop-shadow-md" variants={itemVariants}>
        IDEA GENERATOR
      </motion.p>

      <motion.div className="text-lg max-w-2xl text-center mb-10 leading-relaxed" variants={itemVariants}>
        <ul className="text-left list-disc list-inside mt-4 space-y-2">
          <li><strong>Think</strong> of an innovative and original idea.</li>
          <li><strong>Describe</strong> it briefly in the input box.</li>
          <li><strong>Upload</strong> any file that supports your idea (PDF, image, etc).</li>
          <li><strong>Submit</strong> and let us process your creativity for review!</li>
        </ul>
      </motion.div>

      <motion.div
        className="bg-gray-200 bg-opacity-80 rounded-lg p-6 items-center justify-center shadow-md w-full max-w-4xl"
        variants={itemVariants}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl mb-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.input
            type="text"
            placeholder="EXPLAIN YOUR IDEA"
            value={idea}
            onChange={handleIdeaChange}
            className="flex-1 h-14 p-4 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-white w-96 shadow-md"
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          />

          <motion.label
            htmlFor="file-upload"
            className="flex items-center justify-center gap-2 h-14 px-4 bg-white text-black rounded-md hover:bg-gray-100 cursor-pointer transition-all w-full md:w-auto shadow"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium">UPLOAD FILE</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0L8 7m4-4l4 4" />
            </svg>
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
          </motion.label>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-14 px-6 text-sm font-bold rounded-md transition-all whitespace-nowrap ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-purple-600 hover:bg-gray-200'} shadow-md`}
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Uploading...' : 'GO!!'}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="bg-opacity-10 text-red-700 text-center font-semibold px-6 py-2 rounded shadow">
                {errorMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
