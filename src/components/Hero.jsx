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
            <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-6368-61f7-b4af-a0601f5fbf00/raw?se=2025-04-13T15%3A22%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=70fa6b36-f113-5157-a7ac-e2c2316fcefb&skoid=fa7966e7-f8ea-483c-919a-13acfd61d696&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-13T07%3A24%3A33Z&ske=2025-04-14T07%3A24%3A33Z&sks=b&skv=2024-08-04&sig=i7kc%2BN9fc8kqaCwB1NsYqiJXEv1dhB4k8c/nITohDKo%3D" alt="Life Coaching Session" className="rounded-lg shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;