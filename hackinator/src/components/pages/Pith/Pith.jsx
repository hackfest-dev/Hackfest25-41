'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PitchGenerationPage() {
  const router = useRouter();
  const [pitch, setPitch] = useState('Generating pitch...');
  const [repoLink, setRepoLink] = useState('');
  const [manualIdea, setManualIdea] = useState('');
  const [inputMode, setInputMode] = useState(''); // 'repo' or 'manual'

  useEffect(() => {
    // Simulate pitch generation after a slight delay
    const timer = setTimeout(() => {
      setPitch(
        `Here's a pitch crafted by our AI based on your selected theme and idea:\n\nThis innovative project addresses a key challenge by utilizing the power of [mention relevant tech/approach]. We envision a solution that will [mention key benefits and impact]. The AI has analyzed the core concepts and generated this initial pitch to get you started!`
      );
    }, 1200); // Slightly shorter delay

    return () => clearTimeout(timer); // Clean up the timeout
  }, []);

  const handleStart = () => {
    if (inputMode === 'repo' && !repoLink) {
      alert('Please provide your GitHub repository link.');
      return;
    }
    if (inputMode === 'manual' && !manualIdea) {
      alert('Please describe your idea manually.');
      return;
    }

    // Assuming you want to pass the repoLink or manualIdea to the next page
    const query = {};
    if (repoLink) {
      query.repoLink = repoLink;
    } else if (manualIdea) {
      query.manualIdea = manualIdea;
    }

    router.push({
      pathname: '/next-page', // Replace with your actual next page route
      query: query,
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Hackinator</h1>
        <div>
          <button style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Back to /</button>
          <button style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Profile</button>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>PITCH GENERATION</h2>

      <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem', marginBottom: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <p style={{ fontWeight: 'bold', color: '#555', marginBottom: '0.5rem' }}>Note:</p>
        <p style={{ whiteSpace: 'pre-wrap', color: '#333', lineHeight: '1.6' }}>{pitch}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setInputMode('repo')} style={{ flex: 1, padding: '0.75rem', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer', backgroundColor: inputMode === 'repo' ? '#e0f7fa' : '#f0f0f0' }}>Paste GitHub Repo Link</button>
        <button onClick={() => setInputMode('manual')} style={{ flex: 1, padding: '0.75rem', border: '1px solid #aaa', borderRadius: '4px', cursor: 'pointer', backgroundColor: inputMode === 'manual' ? '#e0f7fa' : '#f0f0f0' }}>Explain Manually</button>
      </div>

      {inputMode === 'repo' && (
        <input
          type="text"
          placeholder="Enter GitHub Repository Link"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      )}

      {inputMode === 'manual' && (
        <textarea
          rows={4}
          placeholder="Manually describe your idea..."
          value={manualIdea}
          onChange={(e) => setManualIdea(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
        />
      )}

      <button onClick={handleStart} style={{ width: '100%', padding: '1rem', fontWeight: 'bold', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>GET STARTED</button>
    </div>
  );
}