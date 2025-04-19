'use client';

import { useState, useEffect } from 'react';
import HackinatorLayout from './(pages)/home/page';
import Thankyou from 'components/ThankYou/ThankYou';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <AnimatedBackground>
      <div className="relative">
        <HackinatorLayout/>
        <Thankyou/>
      </div>
    // </AnimatedBackground>
  );
}
