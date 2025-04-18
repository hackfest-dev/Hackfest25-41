"use client";

export default function Home() {
  const handleGoClick = () => {
    // Placeholder for future functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Input Section */}
      <div className="flex justify-center items-center space-x-2 mb-10">
        <input
          type="text"
          placeholder="PASTE THE GIT REPOSITORY LINK"
          className="px-4 py-2 border-2 border-purple-400 rounded-md w-96 font-mono"
        />
        <button
          onClick={handleGoClick}
          className="px-4 py-2 border-2 border-purple-400 rounded-md font-mono"
        >
          GO
        </button>
      </div>

      {/* Instructions Section */}
      <div className="flex justify-center">
        <div className="w-[600px] h-[300px] bg-purple-100 border-2 border-purple-400 rounded-md flex items-center justify-center text-center font-mono">
          HERE WORKING INSTRUCTION
        </div>
      </div>
    </div>
  );
}
