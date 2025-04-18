'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

const AnimatedSection = ({ 
  children, 
  className = '', 
  scrollSpeed = 0.1,
  direction = 'up', // 'up', 'down', 'left', 'right'
  delay = 0,
  duration = 0.5,
  once = true,
  scale = 1,
  rotate = 0
}) => {
  const sectionRef = useRef(null);
  
  // Set initial animation values based on direction
  const getInitialAnimation = () => {
    switch(direction) {
      case 'up':
        return { y: 50, opacity: 0, scale: scale, rotate: rotate };
      case 'down':
        return { y: -50, opacity: 0, scale: scale, rotate: rotate };
      case 'left':
        return { x: 50, opacity: 0, scale: scale, rotate: rotate };
      case 'right':
        return { x: -50, opacity: 0, scale: scale, rotate: rotate };
      default:
        return { y: 50, opacity: 0, scale: scale, rotate: rotate };
    }
  };
  
  // Set animation target values
  const getTargetAnimation = () => {
    return { y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 };
  };

  return (
    <div 
      ref={sectionRef}
      data-scroll 
      data-scroll-speed={scrollSpeed}
      className={className}
    >
      <motion.div
        initial={getInitialAnimation()}
        whileInView={getTargetAnimation()}
        viewport={{ once }}
        transition={{ 
          duration, 
          delay,
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;
