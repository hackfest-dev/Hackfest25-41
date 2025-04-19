// app/components/pages/Pith/PitchInput.jsx
'use client'
import React, { useState } from 'react';

const PitchInput = ({ mode }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGeneratePitch = () => {
    if (!inputValue.trim()) {
      alert('Please enter something before generating the pitch.');
      return;
    }

    // Placeholder action: replace with your actual logic
    console.log(`Generating pitch using ${mode} input:`, inputValue);
    alert('Pitch generated (see console for now)');
  };

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
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
        {mode === 'repo' ? 'Enter GitHub Repository URL' : 'Describe Your Idea Manually'}
      </h2>

      <textarea
        rows={6}
        placeholder={mode === 'repo' ? 'e.g., https://github.com/user/project' : 'Describe your idea here...'}
        value={inputValue}
        onChange={handleChange}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '1rem',
          fontSize: '1rem',
          border: '2px solid #ccc',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}
      />

      <button
        onClick={handleGeneratePitch}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          border: '2px solid black',
          borderRadius: '8px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        }}
      >
        GENERATE PITCH
      </button>
    </div>
  );
};

export default PitchInput;
