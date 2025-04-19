"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PitchGeneration() {
  const [gitLink, setGitLink] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerateClick = async () => {
    setLoading(true);

    // Simulate waiting for backend response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate getting an ID
    const dummyId = "pitch123";

    setLoading(false);

    // Navigate to result page
    router.push(`/flow/pitch-final?id=${dummyId}`);
  };

  return (
    <div>
      {!showInput && (
        <div className="text-gray-200 bg-slate-950/40 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center justify-center px-4 font-sans">
          <motion.h1
            className="text-4xl font-extrabold mb-8 text-center text-white tracking-wide"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            PITCH GENERATIONS
          </motion.h1>

          <motion.div
            className="w-[650px] h-[300px] bg-white border-4 border-black rounded-2xl p-6 mb-10 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="font-bold text-gray-700 mb-4 text-lg">NOTE:</p>
            <p className="text-center font-medium text-gray-600 text-base tracking-wide">
              All steps and working of pitch will be explained here.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-6 w-full text-black max-w-2xl">
            <Button text="Paste GitHub Repo Link" delay={0.5} />
            <Button text="Explain Manually" delay={0.6} />
          </div>

          <motion.button
            className="w-full max-w-2xl px-6 py-3 bg-black text-white rounded-xl shadow-md text-lg font-semibold tracking-wider hover:bg-gray-800 active:scale-95 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setShowInput(true)}
          >
            Get Started
          </motion.button>
        </div>
      )}

      {showInput && (
        <div className="text-gray-200 bg-slate-950/40 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center justify-center px-4 font-sans">
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Pitch Input Page
          </motion.h1>

          <div className="w-[500px] m-5">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3 shadow-inner">
              <input
                type="text"
                value={gitLink}
                onChange={(e) => setGitLink(e.target.value)}
                placeholder="Paste the GitHub repository link..."
                className="flex-1 outline-none font-mono text-sm bg-transparent placeholder:text-[#a39cd6] text-white"
              />
            </div>
          </div>

          <div className="w-[500px] m-5">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3 shadow-inner">
              <textarea
                placeholder="Explain"
                value={explanation}
                rows={4}
                onChange={(e) => setExplanation(e.target.value)}
                className="flex-1 outline-none font-mono text-sm bg-transparent placeholder:text-[#a39cd6] text-white"
              />
            </div>
          </div>

          <motion.button
            className="px-8 py-3 border-2 border-pink-500 text-pink-600 font-bold uppercase text-sm rounded-lg shadow-md hover:bg-pink-100 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleGenerateClick}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

function Button({ text, delay }) {
  return (
    <motion.button
      className="flex-1 min-w-[200px] px-5 py-3 bg-white border-2 border-black rounded-xl shadow hover:bg-gray-100 font-semibold transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.2, ease: "easeOut" }}
    >
      {text}
    </motion.button>
  );
}
