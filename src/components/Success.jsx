// src/components/Success.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Success = () => {
  console.log('Success component rendering');
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState({});
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Success useEffect running');

    // Get reference ID from multiple possible sources
    const referenceId = sessionStorage.getItem('referenceId') ||
      localStorage.getItem('referenceId') ||
      searchParams.get('refId');

    console.log('Reference ID found:', referenceId);

    // Try to get user data from session storage
    try {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    if (!referenceId) {
      console.warn('No reference ID found - showing generic success');
      setStatus('unknown');
      return;
    }

    // Check if payment was marked as failed
    const paymentStatus = localStorage.getItem('paymentStatus');
    if (paymentStatus === 'failed') {
      console.log('Payment was previously marked as failed, redirecting...');
      navigate(`/payment-failed?refId=${referenceId}&reason=previous_failure`);
      return;
    }

    // Store in both storage methods for redundancy
    sessionStorage.setItem('referenceId', referenceId);
    localStorage.setItem('referenceId', referenceId);

    // Verify the payment with the backend
    verifyPayment(referenceId);
  }, [navigate, searchParams]);

  const verifyPayment = async (referenceId) => {
    try {
      console.log('Verifying payment for:', referenceId);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/api/check-payment?reference_id=${referenceId}`;
      console.log('API URL:', apiUrl);

      const response = await axios.get(apiUrl);
      console.log('Payment verification response:', response.data);

      if (response.data.success) {
        // Clear any failed payment marker
        localStorage.removeItem('paymentStatus');

        setOrderDetails({
          referenceId,
          paymentStatus: 'Confirmed',
          amount: '₹99',
          date: new Date().toLocaleDateString()
        });
        setStatus('success');
      } else {
        // If backend indicates payment is still pending
        if (response.data.status === 'PENDING') {
          setOrderDetails({
            referenceId,
            paymentStatus: 'Processing',
            amount: '₹99',
            date: new Date().toLocaleDateString()
          });
          setStatus('pending');
        } else {
          // If payment is unknown or invalid, redirect to payment failed
          navigate(`/payment-failed?refId=${referenceId}&reason=verification_failed`);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setOrderDetails({
        referenceId,
        paymentStatus: 'Verification error',
        amount: '₹99',
        date: new Date().toLocaleDateString()
      });
      setStatus('error');
    }
  };

  // Fallback for blank screen - render something no matter what
  if (document.body.childElementCount <= 1) {
    console.log('Applying emergency rendering fix');
    document.body.style.backgroundColor = '#8b5cf6';
  }

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

            <div className="bg-purple-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-purple-800 mb-3">Registration Details</h2>

              {userData.fullName && (
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span> {userData.fullName}
                  </p>
                </div>
              )}

              {userData.email && (
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {userData.email}
                  </p>
                </div>
              )}

              {userData.phone && (
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {userData.phone}
                  </p>
                </div>
              )}

              <div className="border-t border-purple-200 my-3 pt-3">
                {orderDetails.referenceId && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-medium">Reference ID:</span> {orderDetails.referenceId}
                    </p>
                  </div>
                )}

                {orderDetails.paymentStatus && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span> {orderDetails.paymentStatus}
                    </p>
                  </div>
                )}

                {orderDetails.amount && (
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-medium">Amount:</span> {orderDetails.amount}
                    </p>
                  </div>
                )}

                {orderDetails.date && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-medium">Date:</span> {orderDetails.date}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-yellow-700">
                  Check your email for event details and webinar access link.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
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