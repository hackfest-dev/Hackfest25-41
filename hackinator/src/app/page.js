'use client';

import { useState, useEffect } from 'react';
import Hackinator from '../app/(pages)/home/page';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
      <div className="relative">
        <Hackinator/>
      </div>
  );
}
