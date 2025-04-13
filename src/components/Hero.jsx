// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Feeling Stuck Or Lost In Life?
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-purple-600 mb-4">
              Battling with Your Health, Relationships, or Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join a Life-Changing 3-Hour Masterclass! Discover How to Break Free from Stress, Confusion & Setbacks and Take Control of Your Life with Clarity and Confidence.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-xl hover:bg-purple-700 transition-all duration-300"
              onClick={() => window.location.href = "/register"}
            >
              Enroll Now - Only ₹99
            </motion.button>
            <p className="text-gray-500 mt-4">
              <span className="line-through">Actual Fee: ₹199</span> - Limited Time Offer!
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <img src="/api/placeholder/600/400" alt="Life Coaching Session" className="rounded-lg shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;