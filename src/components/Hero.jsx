// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-violet-300 to-fuchsia-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-7 text-center md:text-left"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-lg font-medium mb-2 block">
                LIVE ON APRIL 19TH, 11:30 AM
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
              Feeling Stuck Or Lost In <span className="relative">
                <span className="relative z-10">Life?</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-violet-300 to-fuchsia-300 opacity-60 -rotate-2"></span>
              </span>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="w-24 h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6 md:mx-0 mx-auto rounded-full"></motion.div>
            
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-violet-600 mb-4">
              Battling with Your Health, Relationships, or Career?
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl">
              Join a Life-Changing 3-Hour Masterclass! Discover How to Break Free from Stress, Confusion & Setbacks and Take Control of Your Life with Clarity and Confidence.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(112, 26, 117, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:translate-y-1 transition-all duration-300 w-full sm:w-auto"
                onClick={() => window.location.href = "/register"}
              >
                <span className="flex items-center justify-center">
                  Enroll Now - Only ₹99
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </motion.button>
              <span className="text-gray-600 flex items-center">
                <span className="line-through mr-2">Actual Fee: ₹199</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-semibold">50% OFF</span>
              </span>
            </motion.div>
          </motion.div>
          
          {/* Image container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-5 relative"
          >
            <motion.div variants={itemVariants} className="relative">
              {/* Main image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 border-4 border-white">
                <img 
                  src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-6368-61f7-b4af-a0601f5fbf00/raw?se=2025-04-13T15%3A22%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=70fa6b36-f113-5157-a7ac-e2c2316fcefb&skoid=fa7966e7-f8ea-483c-919a-13acfd61d696&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-13T07%3A24%3A33Z&ske=2025-04-14T07%3A24%3A33Z&sks=b&skv=2024-08-04&sig=i7kc%2BN9fc8kqaCwB1NsYqiJXEv1dhB4k8c/nITohDKo%3D" 
                  alt="Life Coaching Session" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Feature cards */}
              <motion.div variants={itemVariants} className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg z-20 transform rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center">⭐</div>
                  <div>
                    <div className="font-bold text-violet-700">Live Interactive</div>
                    <div className="text-sm text-gray-600">Zoom Session</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg z-20 transform -rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center">🧠</div>
                  <div>
                    <div className="font-bold text-violet-700">Holistic Growth</div>
                    <div className="text-sm text-gray-600">Mind, Body, Career</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;