'use client';

import { useEffect, useRef, useState } from 'react';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const SmoothScroll = ({ children }) => {
  const containerRef = useRef(null);
  const [locomotiveScroll, setLocomotiveScroll] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initScroll = async () => {
      if (!containerRef.current) return;
      
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        const scroll = new LocomotiveScroll({
          el: containerRef.current,
          smooth: true,
          lerp: 0.07,
        });
        
        setLocomotiveScroll(scroll);
      } catch (error) {
        console.error("Failed to initialize locomotive scroll:", error);
      }
    };

    initScroll();

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
    };
  }, [locomotiveScroll]);

  return (
    <div data-scroll-container ref={containerRef}>
      {children}
    </div>
  );
};

export default SmoothScroll;
