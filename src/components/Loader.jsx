// src/components/Loader.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ loading = true, size = "medium" }) => {
  // Determine size classes
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32"
  };

  // Control visibility based on loading prop
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      {/* Decorative gradient elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-teal-300 to-emerald-300 rounded-full blur-3xl opacity-20"></div>
      
      <div className="relative">
        {/* Main loader circle */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center`}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Inner static circle */}
          <div className="w-3/4 h-3/4 bg-white rounded-full flex items-center justify-center">
            {/* Pulsing inner gradient circle */}
            <motion.div 
              className="w-2/3 h-2/3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Orbiting elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <motion.div 
            className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      
      {/* Text under the loader */}
      <motion.div 
        className="absolute mt-32 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Loading...
        </div>
        <div className="mt-2 text-gray-600 text-sm">
          Preparing your learning experience
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;