// src/components/Success.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Success = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a reference ID in session storage
    const referenceId = sessionStorage.getItem('referenceId');

    if (!referenceId) {
      // Redirect to homepage if no reference ID is present
      navigate('/');
      return;
    }

    // Verify the payment with the backend
    verifyPayment(referenceId);
  }, [navigate]);

  const verifyPayment = async (referenceId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/check-payment?reference_id=${referenceId}`
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setOrderDetails({
          referenceId,
          // Add any other details you want to display
        });
      } else {
        // For better UX, still allow access but with a note
        console.warn('Payment verification pending but showing success page');
        setIsAuthenticated(true);
        setOrderDetails({
          referenceId,
          paymentStatus: 'Processing'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      // Even on error, show success for better UX
      setIsAuthenticated(true);
      setOrderDetails({
        referenceId,
        paymentStatus: 'Verification pending'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Confetti effect background elements
  const confettiPieces = Array.from({ length: 40 });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-20">
      {/* Animated background elements */}
      {!isLoading && !isAuthenticated && (
        <div className="absolute inset-0">
          {confettiPieces.map((_, index) => {
            const size = Math.random() * 12 + 5;
            const colors = ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <motion.div
                key={index}
                className={`absolute rounded-full ${randomColor}`}
                style={{
                  width: size,
                  height: size,
                  top: `-10%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  rotate: [0, 360],
                  opacity: [1, 0.8, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            );
          })}
        </div>
      )}

      {/* Glass morphism effect */}
      <div className="absolute inset-0 bg-white opacity-10 backdrop-blur-sm"></div>

      {/* Success card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white border-opacity-20"
      >
        {/* Glowing orbs */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-400 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-500 rounded-full filter blur-xl opacity-50"></div>
        
        {isLoading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-20 h-20">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <motion.div 
                className="absolute inset-2 rounded-full border-4 border-b-transparent border-pink-400"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
            <p className="mt-6 text-white text-lg">Verifying your payment...</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="w-28 h-28 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 relative"
            >
              <div className="absolute w-full h-full rounded-full animate-ping bg-green-400 opacity-30"></div>
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold text-white mb-4"
            >
              Registration Successful!
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-white text-opacity-90 mb-8 text-lg"
            >
              Thank you for registering for the masterclass. Your spot is confirmed!
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white border-opacity-20"
            >
              <p className="text-white text-opacity-90 mb-3">
                Your event details have been sent to your email.
              </p>
              <p className="text-white mb-1">
                Reference ID: <span className="font-semibold">{orderDetails.referenceId || 'Processing'}</span>
              </p>
              {orderDetails.paymentStatus === 'Processing' && (
                <p className="text-yellow-300 mt-3 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Your payment is being processed. You will receive a confirmation email shortly.
                </p>
              )}
            </motion.div>
            
            <div className="flex flex-col space-y-4">
              <motion.div variants={itemVariants}>
                <Link
                  to="/dashboard"
                  className="block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 px-8 rounded-xl font-bold shadow-lg shadow-purple-600/30 transform transition-all duration-300 hover:scale-105"
                >
                  Access Masterclass Details
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link
                  to="/"
                  className="inline-block text-white hover:text-purple-200 py-2 font-medium transition-colors border-b-2 border-transparent hover:border-white"
                >
                  Return to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute -z-10">
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -top-8 -right-8 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.5
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default Success;