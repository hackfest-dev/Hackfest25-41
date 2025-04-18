'use client';

import { useState, useEffect } from 'react';
import AnimatedBackground from "@/components/animation/AnimatedBackground";

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <AnimatedBackground>
      <div className="relative min-h-screen">
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10">
          {mounted && (
            <h1 className="text-[160px] font-extrabold text-center text-white">
              Hackinator
            </h1>
          )}
        </div>
      </div>
    // </AnimatedBackground>
  );
}
