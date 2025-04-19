"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Readme() {
  const [repoLink, setRepoLink] = useState("");

  const handleGoClick = () => {
    if (!repoLink.trim()) return;
    // Placeholder for future functionality
    console.log("Repository Link:", repoLink);
  };

  return (
    <div className=" flex flex-col items-center justify-center ">
      {/* Input Section */}
      <div className="mb-12 w-full max-w-xl">
        <div className="flex items-center gap-3 bg-white border-2 border-blue-900 rounded-lg shadow-md p-4">
          <input
            type="text"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            placeholder="Paste the Git repository link..."
            className="flex-1 outline-none font-mono text-sm px-2 bg-transparent placeholder:text-purple-400 placeholder:italic"
          />
          <button
            onClick={handleGoClick}
            className="flex items-center gap-1 px-4 py-2 bg-purple-500 text-white rounded-md font-mono text-sm hover:bg-purple-600 active:scale-95 transition-transform"
          >
            Go
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="w-full max-w-2xl bg-white border-2 border-purple-300 rounded-lg shadow-lg p-8 text-center font-mono text-sm text-purple-700">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <p>
          Paste your public GitHub repository link above and click "Go" to start analyzing your project.
        </p>
        <p className="mt-2">
          The app will fetch the repository content, parse the README and source files, and give you
          an overview or generate insights based on your code.
        </p>
        <p className="mt-2 italic text-purple-500">More features coming soon!</p>
      </div>
      {/* <ReadmeFile/> */}
    </div>
  );
}
