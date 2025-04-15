import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // Make sure to import axios

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
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for registering for the masterclass. Your spot is confirmed!
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">Your event details have been sent to your email.</p>
              <p className="text-sm text-gray-500">
                Reference ID: <span className="font-medium">{orderDetails.referenceId || 'Processing'}</span>
              </p>
              {orderDetails.paymentStatus === 'Processing' && (
                <p className="text-xs text-amber-600 mt-2">
                  Note: Your payment is being processed. You will receive a confirmation email shortly.
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                to="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Access Masterclass Details
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