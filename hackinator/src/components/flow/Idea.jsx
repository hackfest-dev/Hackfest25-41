'use client';
import React, { useState } from 'react';

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
      setErrorMessage('Please explain your idea and upload a file.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      alert('Idea and file uploaded successfully!');
    } catch (error) {
      setLoading(false);
      setErrorMessage('There was an error uploading your idea and file.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start px-4 py-10 text-white">
      <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">Hackinator</h1>

      <p className="mt-12 text-xl font-bold mb-2 drop-shadow-md">IDEA GENERATOR</p>

        <p className="text-lg max-w-2xl text-center mb-10 leading-relaxed">
            <ul className="text-left list-disc list-inside mt-4 space-y-2">
                <li>🧠 <strong>Think</strong> of an innovative and original idea.</li>
                <li>📝 <strong>Describe</strong> it briefly in the input box.</li>
                <li>📎 <strong>Upload</strong> any file that supports your idea (PDF, image, etc).</li>
                <li>🚀 <strong>Submit</strong> and let us process your creativity for review!</li>
            </ul>
        </p>


        <div className='bg-gray-200 bg-opacity-80 rounded-lg p-6 items-center justify-center shadow-md w-full max-w-4xl'>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl mb-6">
                <input
                    type="text"
                    placeholder="EXPLAIN YOUR IDEA"
                    value={idea}
                    onChange={handleIdeaChange}
                    className="flex-1 h-14 p-4 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-white w-96  shadow-md"
                />

                <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 h-14 px-4 bg-white text-black rounded-md hover:bg-gray-100 cursor-pointer transition-all w-full md:w-auto shadow"
                >
                    <span className="text-sm font-medium">UPLOAD FILE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V3m0 0L8 7m4-4l4 4" />
                    </svg>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                </label>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`h-14 px-6 text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                    loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-purple-600 hover:bg-gray-200'
                    } shadow-md`}
                >
                    {loading ? 'Uploading...' : 'GO!!'}
                </button> 
            </div>

            {errorMessage && (
                <div className="flex justify-center mt-6">
                    <p className="bg-opacity-10 text-red-700 text-center font-semibold px-6 py-2 rounded shadow">
                    {errorMessage}
                    </p>
                </div>
            )}
        </div>


    </div>
  );
}
