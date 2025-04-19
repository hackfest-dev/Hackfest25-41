'use client';

import { motion } from 'framer-motion';
import AnimatedHome from '../../../components/Home/AnimatedHome';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <main className="">
      {/* Hero Section */}
      {/* < */}
    </main>
  );
}
