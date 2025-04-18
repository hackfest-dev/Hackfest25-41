'use client';

import { useState, useEffect } from 'react';
import Hackinator from './(pages)/home/page';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <AnimatedBackground>
      <div className="relative min-h-screen">
        <Hackinator/>
      </div>
    // </AnimatedBackground>
  );
}
