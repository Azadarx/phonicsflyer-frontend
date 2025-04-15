// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Fancy animated background with particles
  const particleVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const particleItem = {
    hidden: { opacity: 0 },
    animate: { 
      opacity: [0.2, 0.8, 0.2],
      transition: {
        repeat: Infinity,
        duration: Math.random() * 5 + 2
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 overflow-hidden">
      {/* Animated particles */}
      <motion.div
        variants={particleVariants}
        initial="hidden"
        animate="animate"
        className="absolute inset-0"
      >
        {Array(20).fill().map((_, i) => (
          <motion.div
            key={i}
            variants={particleItem}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(10px)',
              opacity: 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Curved shape divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text content - takes 7 columns on medium screens */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-7 text-center md:text-left text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <span className="text-white font-medium">Live on April 19th, 11:30 AM</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            >
              Feeling Stuck Or Lost In <span className="relative">
                <span className="relative z-10">Life?</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -rotate-2"></span>
              </span>
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl font-medium mb-4 text-yellow-200"
            >
              Battling with Your Health, Relationships, or Career?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-white/90 mb-8 max-w-2xl"
            >
              Join a Life-Changing 3-Hour Masterclass! Discover How to Break Free from Stress, Confusion & Setbacks and Take Control of Your Life with Clarity and Confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 25px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-700 px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-yellow-200 transition-all duration-300 w-full sm:w-auto"
                onClick={() => window.location.href = "/register"}
              >
                Enroll Now - Only ₹99
              </motion.button>
              <span className="text-white/80 flex items-center">
                <span className="line-through mr-2">Actual Fee: ₹199</span>
                <span className="bg-white/20 px-2 py-1 rounded-md text-sm">50% OFF</span>
              </span>
            </motion.div>
          </motion.div>
          
          {/* Image container - takes 5 columns on medium screens */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="md:col-span-5 relative"
          >
            <div className="relative">
              {/* Decorative elements */}
              <motion.div 
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 10 }}
                className="absolute -top-10 -left-10 w-32 h-32 bg-pink-400 rounded-full blur-2xl opacity-60 z-0"
              />
              <motion.div 
                animate={{ 
                  rotate: [0, -15, 0, 15, 0],
                  scale: [1, 1.08, 1, 1.08, 1]
                }}
                transition={{ repeat: Infinity, duration: 12, delay: 2 }}
                className="absolute -bottom-16 -right-8 w-40 h-40 bg-yellow-300 rounded-full blur-2xl opacity-60 z-0"
              />
              
              {/* Main image */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 border-4 border-white/30"
              >
                <img 
                  src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-6368-61f7-b4af-a0601f5fbf00/raw?se=2025-04-13T15%3A22%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=70fa6b36-f113-5157-a7ac-e2c2316fcefb&skoid=fa7966e7-f8ea-483c-919a-13acfd61d696&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-13T07%3A24%3A33Z&ske=2025-04-14T07%3A24%3A33Z&sks=b&skv=2024-08-04&sig=i7kc%2BN9fc8kqaCwB1NsYqiJXEv1dhB4k8c/nITohDKo%3D" 
                  alt="Life Coaching Session" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Decorative shapes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg z-20 transform rotate-6"
              >
                <div className="flex items-center gap-2">
                  <div className="text-yellow-500 text-2xl">⭐</div>
                  <div>
                    <div className="font-bold text-purple-700">Live Interactive</div>
                    <div className="text-sm text-gray-600">Zoom Session</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg z-20 transform -rotate-6"
              >
                <div className="flex items-center gap-2">
                  <div className="text-purple-500 text-2xl">🧠</div>
                  <div>
                    <div className="font-bold text-purple-700">Holistic Growth</div>
                    <div className="text-sm text-gray-600">Mind, Body, Career</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;