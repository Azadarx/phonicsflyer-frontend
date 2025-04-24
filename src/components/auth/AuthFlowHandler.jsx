import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import RegisterForm from './RegisterForm';

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

  // Smooth transition animations
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
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
            className="w-full"
          >
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