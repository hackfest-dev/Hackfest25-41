'use client';

import { motion } from 'framer-motion';
import AnimatedHome from '../../components/Home/AnimatedHome';

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
    <main className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col items-center justify-center px-6 py-12 space-y-20">
      {/* Hero Section */}
      <motion.section
        className="max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-5xl md:text-6xl font-extrabold mb-6" variants={itemVariants}>
          <AnimatedHome text="Welcome to Our Website" delay={50} />
        </motion.h1>
        <motion.p className="text-lg md:text-xl mb-8" variants={itemVariants}>
          Discover amazing features and seamless experience with our platform.
        </motion.p>
        <motion.button
          className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-white bg-opacity-20 rounded-lg p-6" variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-4">Feature One</h3>
          <p>Experience fast and reliable performance with our cutting-edge technology.</p>
        </motion.div>
        <motion.div className="bg-white bg-opacity-20 rounded-lg p-6" variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-4">Feature Two</h3>
          <p>Enjoy a user-friendly interface designed for ease of use and accessibility.</p>
        </motion.div>
        <motion.div className="bg-white bg-opacity-20 rounded-lg p-6" variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-4">Feature Three</h3>
          <p>Stay connected with real-time updates and seamless integrations.</p>
        </motion.div>
      </motion.section>
    </main>
  );
}
