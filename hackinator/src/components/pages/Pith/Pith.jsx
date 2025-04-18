// app/components/pages/Pith/Pith.jsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Pith = () => {
  const [mode, setMode] = useState(null);
  const [started, setStarted] = useState(false);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleStart = () => {
    if (mode) {
      setStarted(true);
    } else {
      alert('Please select a mode first.');
    }
  };

  if (started) {
    const PitchInput = dynamic(() => import('./PitchInput'), { ssr: false });
    return <PitchInput mode={mode} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
        Pitch Generations
      </h2>

      <div style={{
        border: '2px solid black',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        lineHeight: '1.6',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <strong>NOTE:</strong>
        <p style={{ marginTop: '1rem' }}>
          This section provides a detailed explanation of the pitch generation process.
          It describes how input is taken from either a GitHub repository or manual explanation,
          and how it's analyzed and structured to generate a compelling pitch.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => handleModeSelect('repo')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            border: mode === 'repo' ? '3px solid black' : '2px solid black',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '25px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            color: '#000',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          PASTE GITHUB REPO LINK
        </button>

        <button
          onClick={() => handleModeSelect('manual')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            border: mode === 'manual' ? '3px solid black' : '2px solid black',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '25px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            color: '#000',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          EXPLAIN MANUALLY
        </button>
      </div>

      <button
        onClick={handleStart}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          border: '2px solid black',
          borderRadius: '10px',
          background: '#fff',
          cursor: 'pointer'
        }}
      >
        GET STARTED
      </button>
    </div>
  );
};

export default Pith;
