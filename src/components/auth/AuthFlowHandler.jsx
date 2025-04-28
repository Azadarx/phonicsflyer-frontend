import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';
import RegisterForm from '../RegisterForm';

const AuthFlowHandler = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Effect to check auth status and show modal if needed
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      // If user is already signed in, ensure modal is closed
      setShowAuthModal(false);
    }
  }, [currentUser]);

  // Handle auth modal close
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    
    // If user is still not authenticated after modal closes, redirect to home
    if (!currentUser) {
      navigate('/');
    }
  };

  // Enhanced smooth transition animations with updated styling
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.4,
        ease: "easeIn" 
      }
    }
  };

  return (
    <>
      {/* Show registration form with animation when user is signed in */}
      <AnimatePresence mode="wait">
        {currentUser && (
          <motion.div
            key="register-form"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="w-full relative z-10"
          >
            {/* Decorative elements like in Hero component */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-teal-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-teal-300 to-emerald-300 rounded-full blur-3xl opacity-20"></div>
            
            <RegisterForm />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal for handling user authentication */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={handleAuthModalClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthFlowHandler;