import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthModal = ({ isOpen, onClose }) => {
  const [showSignIn, setShowSignIn] = useState(true);
  
  // Added to manage accessibility and prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the background when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      // Clean up on unmount
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };
  
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } }
  };

  // Handle clicks outside the modal
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
        onClick={handleOutsideClick}
      >
        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-br from-teal-300 to-blue-300 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-gradient-to-tr from-blue-300 to-teal-300 rounded-full blur-3xl opacity-10"></div>
        
        <motion.div
          variants={contentVariants}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative accent bar at top */}
          <div className="h-2 bg-gradient-to-r from-teal-600 to-blue-600"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 transition-all duration-300 hover:scale-110"
            aria-label="Close authentication modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {showSignIn ? (
            <SignIn onClose={onClose} switchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUp onClose={onClose} switchToSignIn={() => setShowSignIn(true)} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;