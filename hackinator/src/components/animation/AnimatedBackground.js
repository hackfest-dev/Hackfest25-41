'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NeatGradient } from '@firecms/neat';

export default function AnimatedBackground() {
  const gradientRef = useRef(null);
  const [showHackinator, setShowHackinator] = useState(false);

  useEffect(() => {
    if (!gradientRef.current) return;

    const neat = new NeatGradient({
      ref: gradientRef.current,
      colors: [
        { color: '#0f0c29', enabled: true }, // deep violet/navy
        { color: '#302b63', enabled: true }, // rich indigo
        { color: '#f5f5f5', enabled: true }, // soft white (for contrast)
        { color: '#24243e', enabled: true }, // muted dark purple
        { color: '#16213e', enabled: true }, // deep blue
      ]
      ,
      speed: 2,
      horizontalPressure: 3,
      verticalPressure: 5,
      waveFrequencyX: 1,
      waveFrequencyY: 3,
      waveAmplitude: 8,
      shadows: 0,
      highlights: 2,
      colorBrightness: 1,
      colorSaturation: 6,
      wireframe: false,
      colorBlending: 7,
      backgroundColor: '#003FFF',
      backgroundAlpha: 1,
      grainScale: 2,
      grainSparsity: 0,
      grainIntensity: 0.175,
      grainSpeed: 1,
      resolution: 1,
    });

    // Hide NEAT branding immediately by CSS
    const style = document.createElement('style');
    style.innerHTML = `
      a[href="https://neat.firecms.co"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
      }
    `;
    document.head.appendChild(style);

    // Use MutationObserver to remove branding if added later
    const observer = new MutationObserver(() => {
      const branding = document.querySelector('a[href="https://neat.firecms.co"]');
      if (branding) {
        branding.remove();
        setShowHackinator(true); // Show Hackinator label
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      neat.destroy();
      observer.disconnect();
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);


  return (
    <>
      <canvas
        id="gradient"
        ref={gradientRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
        }}
      />
    </>
  );
}
