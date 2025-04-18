'use client'
import React, { useState } from 'react'

export default function PithFlow() {
    const [repoLink, setRepoLink] = useState('');
    const [manualMode, setManualMode] = useState(false);
    const [ideaExplanation, setIdeaExplanation] = useState('');
  
    const handleStart = () => {
      alert(`Pitch Started!\nRepo: ${repoLink}\n${manualMode ? 'Idea: ' + ideaExplanation : 'AI mode selected'}`);
    };
  
    return (
      <div style={{ padding: '2rem', fontFamily: 'Comic Sans MS', border: '2px solid black', maxWidth: '800px', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div><strong style={{ fontSize: '1.8rem' }}>Hackinator</strong></div>
          <div>
            <button style={{ marginRight: '0.5rem' }}>BACK TO /</button>
            <button>PROFILE!!</button> 
          </div>
        </div>
  
        <h2 style={{ textAlign: 'center' }}>PITH GENARATIONS</h2>
  
        <div style={{ border: '2px solid black', padding: '1rem', marginBottom: '2rem' }}>
          <p><strong>NOTE:</strong></p>
          <p style={{ textAlign: 'center' }}>ALL STEPS AND WORKING OF PITCH WILL BE EXPLAINED HERE</p>
        </div>
  
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => setManualMode(false)} style={{ width: '48%' }}>PASTE GITHUB REPO LINK</button>
          <button onClick={() => setManualMode(true)} style={{ width: '48%' }}>EXPLAIN MANUALLY</button>
        </div>
  
        {!manualMode ? (
          <input
            type="text"
            placeholder="Enter GitHub Repo Link"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        ) : (
          <textarea
            rows={4}
            placeholder="Describe your project idea manually..."
            value={ideaExplanation}
            onChange={(e) => setIdeaExplanation(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        )}
  
        <button onClick={handleStart} style={{ width: '100%', padding: '1rem', fontWeight: 'bold' }}>GET STARTED</button>
      </div>
    );
  }