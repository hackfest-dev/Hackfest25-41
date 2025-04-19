'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function IdeaFlow() {
  const [idea, setIdea] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showThemes, setShowThemes] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [customTheme, setCustomTheme] = useState('');
  const [themeOptions, setThemeOptions] = useState([]);

  const router = useRouter();

  const handleIdeaChange = (e) => setIdea(e.target.value);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const dummyThemes = [
        "AI-powered learning assistant",
        "Braille-to-speech converter",
        "Voice-based classroom notes",
        "Smart attendance system",
        "Offline audio content generator"
      ];
      setThemeOptions(dummyThemes);
      setShowThemes(true);
      setLoading(false);
      toast.success("Idea and file uploaded successfully!", { position: "top-center" });
      toast.info("Themes generated. Please select one.", { position: "top-center" });
    } catch (error) {
      setLoading(false);
      const errorText = error.message || 'There was an error uploading your idea and file.';
      toast.error(errorText);
      setErrorMessage(errorText);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleFinalSubmit = () => {
    const finalSelection = [...selectedThemes];
    if (customTheme.trim()) finalSelection.push(customTheme.trim());

    toast.success(`Selected theme sent to server!`, { position: "top-center" });
    router.push('/flow/problem-selector');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } }
  };

  return (
    <motion.div
      className="text-gray-200 bg-slate-950/40 backdrop-blur-lg rounded-2xl p-6 items-center justify-center shadow-xl border border-black/20 w-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {!showThemes && (
        <>
          <motion.h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg" variants={itemVariants}>
            Hackinator
          </motion.h1>

          <motion.p className="mt-12 text-xl font-bold mb-2 drop-shadow-md" variants={itemVariants}>
            PROBLEM STATEMENT GENERATOR
          </motion.p>

          <motion.div className="text-lg max-w-2xl text-center mb-10 leading-relaxed" variants={itemVariants}>
            <ul className="text-left list-disc list-inside mt-4 space-y-2">
              <li><strong>Think</strong> of an innovative and original idea.</li>
              <li><strong>Describe</strong> it briefly in the input box.</li>
              <li><strong>Upload</strong> any file that supports your idea (PDF, image, etc).</li>
              <li><strong>Submit</strong> and let us process your creativity for review!</li>
            </ul>
          </motion.div>

          <motion.div className="bg-white/10 rounded-lg p-6 shadow-md w-full max-w-4xl" variants={itemVariants}>
            <motion.div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2"
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>

              <motion.input
                type="text"
                placeholder="EXPLAIN YOUR PROBLEM STATEMENT"
                value={idea}
                onChange={handleIdeaChange}
                className="flex-1 h-14 p-4 rounded-md border border-gray-300 bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white w-full md:w-96 shadow-md"
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 h-14 px-4 bg-white/10 text-white rounded-md hover:bg-white/20 cursor-pointer transition-all w-full md:w-auto shadow"
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
                className={`h-14 px-6 text-sm font-bold rounded-md transition-all duration-200 ${loading ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} shadow-md`}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Uploading...' : 'GO!!'}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {errorMessage && (
                <motion.div className="flex justify-center mt-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="bg-opacity-10 text-red-300 text-center font-semibold px-6 py-2 rounded shadow">
                    {errorMessage}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {showThemes && (
        <motion.div className="w-full max-w-7xl px-4 space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-extrabold text-center mb-2">Choose a Theme</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {themeOptions.map((theme, idx) => (
              <motion.div
                key={idx}
                className={`flex items-center justify-between border border-gray-300 rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${selectedThemes.includes(theme) ? 'ring-2 ring-purple-500' : ''}`}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-lg font-medium">{theme}</span>
                <button
                  className={`px-4 py-1.5 text-sm rounded-full font-semibold transition-all duration-200 ${selectedThemes.includes(theme) ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {selectedThemes.includes(theme) ? '✓ Selected' : 'Select'}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-white/10 rounded-lg p-6 shadow-md">
            <input
              type="text"
              placeholder="Or add your own theme..."
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              className="w-full border-b-2 border-purple-300 bg-transparent text-lg p-2 text-white focus:outline-none focus:border-purple-600 placeholder-white"
            />
          </div>

          <div className="text-center">
            <motion.button
              onClick={handleFinalSubmit}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center justify-center px-10 py-3 mt-6 font-semibold text-white rounded-2xl shadow-xl overflow-hidden group bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></span>
              <span className="relative flex items-center gap-2 z-10">
                <span>Submit Selected Theme(s)</span>
                <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8V4z" />
                </motion.svg>
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
  