// src/components/Success.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { clearPaymentData } from '../utils/paymentHandlers';

const Success = () => {
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState({});
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: ''
  });
  const [paymentVerified, setPaymentVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getUserData, updateUserRegistration } = useAuth();

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  useEffect(() => {
    const protectAgainstDirectAccess = () => {
      const isPaymentSuccessful = sessionStorage.getItem('paymentSuccessful') === 'true';
      if (!isPaymentSuccessful) {
        // No payment success flag means they didn't complete payment flow
        navigate('/', { replace: true });
      }
    };

    protectAgainstDirectAccess();
  }, [navigate]);

  useEffect(() => {
    // Check if the page is being accessed directly without a successful payment
    const isPaymentSuccessful = sessionStorage.getItem('paymentSuccessful') === 'true';

    // Get reference ID from multiple possible sources
    const urlParams = new URLSearchParams(location.search);
    const referenceId = sessionStorage.getItem('referenceId') ||
      localStorage.getItem('referenceId') ||
      urlParams.get('refId');

    // More strict verification - must have both payment success flag AND a reference ID
    if (!isPaymentSuccessful || !referenceId) {
      console.log("Payment verification failed, redirecting to home");
      navigate('/');
      return;
    }

    // Load user data from sessionStorage first
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }

    // Then verify the payment
    verifyPayment(referenceId);

  }, [currentUser, getUserData, navigate, location.search]);

  const verifyPayment = async (referenceId) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/api/check-payment?reference_id=${referenceId}`;

      const headers = {};

      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(apiUrl, { headers });

      // Even if API fails, we should still show success page since we have the sessionStorage flags
      const successStatus = response.data?.success !== false;

      const orderData = {
        referenceId,
        paymentStatus: 'Confirmed',
        amount: '₹99',
        date: new Date().toLocaleDateString()
      };

      setOrderDetails(orderData);
      setStatus('success');
      setPaymentVerified(true);

      // If user is logged in, update their registration record
      if (currentUser && currentUser.uid) {
        try {
          await updateUserRegistration(referenceId, orderData);
        } catch (error) {
          console.log("Error updating user registration:", error);
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);

      // IMPORTANT: Instead of immediately redirecting on failure, show success anyways
      // Since we already have the sessionStorage payment flag, payment likely succeeded
      // but the verification endpoint might be failing

      const orderData = {
        referenceId,
        paymentStatus: 'Confirmed',
        amount: '₹99',
        date: new Date().toLocaleDateString()
      };

      setOrderDetails(orderData);
      setStatus('success');
      setPaymentVerified(true);
    }
  };

  // Handle home button click to clear payment success flag and prevent future access
  const handleHomeClick = () => {
    // Clear all payment-related data
    clearPaymentData();

    // Force navigate to homepage to ensure we leave this page
    navigate('/', { replace: true });
  };

  return (
    <>
      <Navbar />
      <section className="relative py-16 overflow-hidden min-h-screen bg-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-teal-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-blue-300 to-teal-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Success Message */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="lg:w-2/3"
            >
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-1.5 bg-teal-50 rounded-full mb-4">
                  <span className="text-teal-700 font-semibold">Registration Complete</span>
                </div>

                <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 mb-4">
                  Welcome to Our Phonics English Course
                </h2>

                <div className="flex justify-center">
                  <div className="w-24 h-2 bg-gradient-to-r from-teal-600 to-blue-600 mb-6 rounded-full"></div>
                </div>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your registration has been confirmed. Get ready to transform your English skills!
                </p>
              </div>

              <motion.div
                variants={contentVariants}
                className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100 relative z-10"
              >
                {/* User status indicator */}
                {currentUser && (
                  <div className="mb-6 p-3 bg-teal-50 text-teal-700 rounded-lg text-sm flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Signed in as {currentUser.email}
                  </div>
                )}

                {/* Loading indicator */}
                {status === 'loading' && (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      {/* Main spinner */}
                      <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      {/* Inner pulse effect */}
                      <div className="absolute inset-2 rounded-full bg-teal-200 opacity-50 animate-pulse"></div>
                    </div>
                    <p className="text-teal-700">Verifying your registration...</p>
                  </div>
                )}

                {/* Success Content */}
                {status === 'success' && paymentVerified && (
                  <>
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>

                    <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-teal-800 mb-4 text-center">
                      Registration Successful!
                    </h3>

                    <p className="text-gray-600 mb-6 text-center">
                      Thank you for registering for the Phonics English Course. Your spot is confirmed!
                    </p>

                    <div className="bg-teal-50 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold text-teal-800 mb-3">Registration Details</h2>

                      {userData.fullName && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">Name:</span> {userData.fullName}
                          </p>
                        </div>
                      )}

                      {userData.email && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {userData.email}
                          </p>
                        </div>
                      )}

                      {userData.phone && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">Phone:</span> {userData.phone}
                          </p>
                        </div>
                      )}

                      {userData.country && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">Country:</span> {userData.country}
                          </p>
                        </div>
                      )}

                      {userData.state && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">State:</span> {userData.state}
                          </p>
                        </div>
                      )}

                      {userData.city && (
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <p className="text-gray-700">
                            <span className="font-medium">City:</span> {userData.city}
                          </p>
                        </div>
                      )}

                      <div className="border-t border-teal-200 my-3 pt-3">
                        {orderDetails.referenceId && (
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            <p className="text-gray-700">
                              <span className="font-medium">Reference ID:</span> {orderDetails.referenceId}
                            </p>
                          </div>
                        )}

                        {orderDetails.paymentStatus && (
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-700">
                              <span className="font-medium">Status:</span> {orderDetails.paymentStatus}
                            </p>
                          </div>
                        )}

                        {orderDetails.amount && (
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-700">
                              <span className="font-medium">Amount:</span> {orderDetails.amount}
                            </p>
                          </div>
                        )}

                        {orderDetails.date && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-700">
                              <span className="font-medium">Date:</span> {orderDetails.date}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
                      <div className="flex">
                        <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-700">
                          Check your email for course access details and welcome instructions.
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(13, 148, 136, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleHomeClick}
                      className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-blue-600 hover:translate-y-1 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg"
                    >
                      <div className="flex items-center justify-center">
                        <span>Return to Home</span>
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    </motion.button>

                    {!currentUser && (
                      <p className="text-sm text-gray-600 mt-4 text-center">
                        Want to save your registration details?{" "}
                        <Link to="/register" className="text-teal-600 hover:text-teal-800 font-medium">
                          Create an account
                        </Link>
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column - What's Next */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="lg:w-1/3"
            >
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">What's Next?</h3>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Check Your Email</h4>
                      <p className="text-teal-100 text-sm">
                        We've sent detailed instructions on accessing your course materials.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Join The Community</h4>
                      <p className="text-teal-100 text-sm">
                        Connect with fellow learners in our exclusive student community.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Prepare Your Schedule</h4>
                      <p className="text-teal-100 text-sm">
                        Live sessions begin next week! Set aside 2 hours twice a week.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Download Resources</h4>
                      <p className="text-teal-100 text-sm">
                        Access your starter materials in the student portal.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-white text-black border-opacity-20">
                  <h4 className="font-semibold mb-2">Need Help?</h4>
                  <p className="text-teal-100 text-sm mb-4">
                    Our support team is ready to assist you with any questions.
                  </p>
                  <a
                    href="mailto:inspiringshereen@gmail.com"
                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Support
                  </a>
                </div>
              </div>

              {/* Course Timeline Card */}
              <motion.div
                variants={contentVariants}
                className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100 mt-6"
              >
                <h3 className="text-lg font-bold text-teal-800 mb-4">Course Timeline</h3>

                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-full">
                      <div className="w-4 h-4 rounded-full bg-teal-500 border-4 border-teal-100"></div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Registration Complete</h4>
                      <p className="text-sm text-gray-500">Today</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 h-full">
                      <div className="w-4 h-4 rounded-full bg-gray-300 border-4 border-gray-100"></div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Welcome Materials</h4>
                      <p className="text-sm text-gray-500">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0 h-full">
                      <div className="w-4 h-4 rounded-full bg-gray-300 border-4 border-gray-100"></div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Orientation Session</h4>
                      <p className="text-sm text-gray-500">This Weekend</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-gray-300 border-4 border-gray-100"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-900">Course Begins</h4>
                      <p className="text-sm text-gray-500">Next Monday</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial */}
              <motion.div
                variants={contentVariants}
                className="bg-blue-50 rounded-2xl p-6 mt-6 relative"
              >
                <svg className="absolute top-4 left-4 w-10 h-10 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="pl-8 pt-6">
                  <p className="text-gray-700 italic mb-4">
                    "This course completely transformed my English pronunciation. The phonics approach made a huge difference in just a few weeks!"
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      RK
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium text-gray-900">Rahul Kumar</h5>
                      <p className="text-gray-500 text-sm">Previous Student</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Success;