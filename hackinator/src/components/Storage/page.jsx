"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, Plus, Edit3, Sparkles } from 'lucide-react';

export default function PitchPageFinal() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(0);

  const ideas = Array(5).fill(null).map((_, i) => ({
    id: i,
    title: `Strategic Concept ${i + 1}`,
    preview: 'Transformative approach to industry challenges...',
  }));

  return (
    <div className="max-w-screen bg-slate-950/40 backdrop-blur-lg text-gray-200 flex overflow-hidden relative">
      {/* Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-80 bg-slate-950/70 backdrop-blur-xl border-r border-slate-800 flex flex-col"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold">Concept Archive</h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <button className="w-full flex items-center gap-3 py-3 px-4 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-amber-400" />
                <span className="font-medium">New Draft</span>
              </button>

              {ideas.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedIdea === i 
                      ? 'bg-slate-800/60 border border-amber-400/20'
                      : 'bg-slate-800/30 hover:bg-slate-800/40 border border-transparent'
                  }`}
                  onClick={() => setSelectedIdea(i)}
                >
                  <h3 className="text-sm font-medium">{idea.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{idea.preview}</p>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Menu Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-6 left-6 z-20 p-2.5 bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-lg shadow hover:bg-slate-800/80 transition-colors"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-[2px] bg-amber-400 transition-transform ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`block w-6 h-[2px] bg-amber-400 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-[2px] bg-amber-400 transition-transform ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </div>
        </motion.button>

        {/* Pitch Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-xl rounded-xl border border-slate-800 shadow-xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-400/10 rounded-lg border border-amber-400/20">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold">Quantum Market Solution</h1>
            </div>
            <p className="text-slate-300 leading-relaxed">
              A next-generation platform combining AI analytics with blockchain security to create 
              transparent, efficient market ecosystems. Leveraging decentralized computing power 
              to deliver real-time insights while maintaining GDPR compliance and enterprise-grade security.
            </p>
          </div>

          <div className="p-8 bg-slate-900/50">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400">Core Advantages</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Dynamic Adaptation</p>
                      <p className="text-slate-400 mt-1">Self-learning algorithms</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">Zero Trust Architecture</p>
                      <p className="text-slate-400 mt-1">Military-grade encryption</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400">Development Phase</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-amber-400">65%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full">
                    <div className="w-2/3 h-full bg-amber-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full flex items-center justify-center gap-3 py-3 px-6 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded-lg text-amber-400 font-medium transition-colors">
              <Edit3 className="w-5 h-5" />
              Enhance Proposal
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}