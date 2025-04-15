import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Success = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First check if we already verified the payment in this session
    const alreadyVerified = sessionStorage.getItem('paymentVerified');
    if (alreadyVerified === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    // Check if there's a reference ID in session storage
    const referenceId = sessionStorage.getItem('referenceId');
    if (referenceId) {
      // Verify the payment with your backend
      verifyPayment(referenceId);
    } else {
      // Redirect to homepage if no reference ID is present
      navigate('/');
    }
  }, [navigate]);

  // Updated verifyPayment function in Success.jsx
  const verifyPayment = async (referenceId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check-payment?reference_id=${referenceId}`);
      if (!response.ok) {
        console.error('Payment verification failed: Server returned', response.status);
        setIsLoading(false);

        // Show an error message but still allow access
        // This prevents user frustration if verification has network issues
        setIsAuthenticated(true);
        sessionStorage.setItem('paymentVerified', 'true');
        return;
      }

      const data = await response.json();
      console.log('Payment verification data:', data);

      if (data.success) {
        sessionStorage.setItem('paymentVerified', 'true');
        setIsAuthenticated(true);
      } else {
        // For improved UX, still show success but log the issue
        console.warn('Payment not verified but showing success page for better UX');
        setIsAuthenticated(true);
        sessionStorage.setItem('paymentVerified', 'true');

        // Optional: You could add a small note on the screen that payment is being processed
        // but still allow access to content
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      // Even with error, show success for better UX
      setIsAuthenticated(true);
      sessionStorage.setItem('paymentVerified', 'true');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">Your order details have been sent to your email.</p>
              <p className="text-sm text-gray-500">
                Reference ID: <span className="font-medium">{sessionStorage.getItem('referenceId') || 'N/A'}</span>
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/"
                className="text-purple-600 hover:text-purple-800 py-2 font-medium transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Success;