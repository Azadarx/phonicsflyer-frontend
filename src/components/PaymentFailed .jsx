// src/components/PaymentFailed.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason') || 'unknown';
  const referenceId = searchParams.get('refId');
  
  useEffect(() => {
    // Clear any payment session if payment failed
    if (reason === 'failed' || reason === 'cancelled') {
      // Keep reference ID but mark it as failed
      if (referenceId) {
        localStorage.setItem('paymentStatus', 'failed');
      }
    }
    
    // Automatically redirect to registration page after 10 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/#register');
    }, 10000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate, reason, referenceId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-pink-500 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment {reason === 'cancelled' ? 'Cancelled' : 'Failed'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {reason === 'cancelled' 
            ? "You've cancelled the payment process."
            : "We couldn't process your payment at this time."}
        </p>
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 text-left">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              {reason === 'cancelled'
                ? "You can try again to secure your spot in the masterclass."
                : "Please try again with a different payment method or contact support if the issue persists."}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/#register"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Return to Home
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">
            You'll be redirected to the registration page in 10 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;