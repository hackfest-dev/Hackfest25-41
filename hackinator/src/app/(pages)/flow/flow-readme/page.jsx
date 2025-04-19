"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ReadmeFilee from "./ReadmeFilee";
import { toast } from "react-toastify";

export default function ReadmeFlow() {
  const [repoLink, setRepoLink] = useState("");
  const [showReadmeFilee, setShowReadmeFilee] = useState(false);
  const [error, setError] = useState("");

  // ✅ GitHub Repo URL pattern: https://github.com/user/repo or https://github.com/user/repo/
  const isValidGithubLink = (url) => {
    const githubRepoRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    return githubRepoRegex.test(url);
  };

  const handleGoClick = () => {
    if (!repoLink.trim()) {
      toast.error("Please enter a GitHub repository link.");
      setError("Please enter a GitHub repository link.");
      return;
    }

    if (!isValidGithubLink(repoLink)) {
      toast.error("Please enter a valid GitHub repository URL.");
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setError("");
    console.log("Repository Link:", repoLink);
    setShowReadmeFilee(true);
  };

  if (showReadmeFilee) {
    return <ReadmeFilee repoLink={repoLink} />;
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 py-10">
      {/* Background blur for the full screen */}
      <div className="absolute inset-0 z-0 backdrop-blur-sm" />

      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Input Section */}
        <div className="mb-6 w-full max-w-xl">
          {error && (
            <p className="mt-2 text-red-400 text-xs font-mono">{error}</p>
          )}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/10 rounded-lg p-4">
            <input
              type="text"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="Paste the Git repository link..."
              className="flex-1 outline-none font-mono text-sm px-2 bg-transparent placeholder:text-[#ffffff] placeholder:italic text-[#ffffff]"
            />
            <button
              onClick={handleGoClick}
              className="flex items-center gap-1 px-4 py-2 bg-[#ffffff] text-black rounded-md font-mono text-sm hover:bg-[#f0f0f0] active:scale-95 transition-transform"
            >
              Go
              <ArrowRight size={16} />
            </button>
          </div>
          {/* Show error message */}
          
        </div>

        {/* Instructions Section */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner shadow-black/10 rounded-lg p-8 text-center font-mono text-sm text-[#f5f5f5]">
          <h2 className="text-xl font-semibold mb-4 text-[#f5f5f5]">How It Works</h2>
          <p>
            Paste your public GitHub repository link above and click "Go" to start analyzing your project.
          </p>
          <p className="mt-2">
            The app will fetch the repository content, parse the README and source files, and give you
            an overview or generate insights based on your code.
          </p>
        </div>

      </div>
    </div>
  );
}
