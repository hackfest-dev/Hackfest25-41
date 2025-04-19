"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import FuturisticReadme from "./ReadmeFilee";


export default function ReadmeFlow() {
  const [repoLink, setRepoLink] = useState("");
  const [showReadme, setShowReadme] = useState(false);

  const handleGoClick = () => {
    if (!repoLink.trim()) return;
    console.log("Repository Link:", repoLink);
    setShowReadme(true);
  };  

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16">
      {showReadme ? (
        <FuturisticReadme />
      ) : (
        <div className="relative w-full max-w-4xl h-[480px] bg-gradient-to-br from-[#0f0c29] to-[#302b63] rounded-2xl shadow-2xl overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/20 z-0 rounded-2xl" />
  
          {/* Main content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-8 gap-8">
            {/* Input Section */}
            <div className="w-full max-w-xl">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3 shadow-inner">
                <input
                  type="text"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  placeholder="Paste the GitHub repository link..."
                  className="flex-1 outline-none font-mono text-sm bg-transparent placeholder:text-[#a39cd6] text-white"
                />
                <button
                  onClick={handleGoClick}
                  className="flex items-center gap-1 px-4 py-2 bg-[#403d7c] hover:bg-[#2c2963] active:scale-95 transition-transform text-white rounded-md font-mono text-sm"
                >
                  Go
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
  
            {/* Instructions Section */}
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-6 py-6 text-center text-sm font-mono text-white">
              <h2 className="text-xl font-semibold mb-3">How It Works</h2>
              https://github.com/NITHINKR06/star-animation-background
              <p>
                Paste your public GitHub repository link above and click <strong>"Go"</strong> to start analyzing your project.
              </p>
              <p className="mt-2">
                The app will fetch the repository content, parse the README and source files, and provide insights based on your code.
              </p>
              <p className="mt-3 italic text-[#a39cd6]">More features coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
