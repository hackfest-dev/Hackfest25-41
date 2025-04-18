'use client';

import { useState, useEffect } from 'react';
import HackinatorLayout from './(pages)/home/page';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <AnimatedBackground>
      <div className="relative">
        <HackinatorLayout/>
      </div>
    // </AnimatedBackground>
  );
}
