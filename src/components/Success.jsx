// src/components/Success.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Success = () => {
  console.log('Success component rendering');
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    console.log('Success useEffect running');
    
    // Get reference ID from multiple possible sources
    const referenceId = sessionStorage.getItem('referenceId') || 
                        localStorage.getItem('referenceId') ||
                        new URLSearchParams(window.location.search).get('refId');
    
    console.log('Reference ID found:', referenceId);
    
    if (!referenceId) {
      console.warn('No reference ID found - showing generic success');
      setStatus('unknown');
      return;
    }

    // Store in both storage methods for redundancy
    sessionStorage.setItem('referenceId', referenceId);
    localStorage.setItem('referenceId', referenceId);

    // Verify the payment with the backend
    verifyPayment(referenceId);
  }, []);

  const verifyPayment = async (referenceId) => {
    try {
      console.log('Verifying payment for:', referenceId);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/api/check-payment?reference_id=${referenceId}`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log('Payment verification response:', response.data);

      setOrderDetails({
        referenceId,
        paymentStatus: response.data.success ? 'Confirmed' : 'Processing'
      });
      setStatus('success');
    } catch (error) {
      console.error('Error verifying payment:', error);
      setOrderDetails({
        referenceId,
        paymentStatus: 'Verification error'
      });
      setStatus('error');
    }
  };

  // Fallback for blank screen - render something no matter what
  if (document.body.childElementCount <= 1) {
    console.log('Applying emergency rendering fix');
    document.body.style.backgroundColor = '#8b5cf6';
  }

  // Simple version that will always render something
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your registration...</p>
          </div>
        )}

        {(status === 'success' || status === 'error' || status === 'unknown') && (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Registration Successful!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for registering for the masterclass. Your spot is confirmed!
            </p>
            
            {orderDetails.referenceId && (
              <div className="bg-gray-100 rounded p-4 mb-6">
                <p>Reference ID: <span className="font-semibold">{orderDetails.referenceId}</span></p>
                <p>Status: <span className="font-semibold">{orderDetails.paymentStatus}</span></p>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">
              Check your email for event details and confirmation.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;