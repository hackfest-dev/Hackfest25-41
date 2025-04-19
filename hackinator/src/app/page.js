'use client';

import { useState, useEffect } from 'react';
import HackinatorLayout from './(pages)/home/page';
import Thankyou from '@/components/ThankYou/Tahnkyou';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
      <div className="relative">
        <HackinatorLayout/>
      </div>
  );
}
