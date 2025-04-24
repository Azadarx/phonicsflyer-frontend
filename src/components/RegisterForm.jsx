import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'error'
  const navigate = useNavigate();
  const { currentUser, updateUserRegistration } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.displayName || formData.fullName,
        email: currentUser.email || formData.email,
        phone: formData.phone // Phone may need to be fetched from Firestore
      });
    }
  }, [currentUser]);

  // Simplified animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
        setError("Payment gateway failed to load. Please refresh the page.");
      };
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is authenticated - should already be handled by AuthFlowHandler
    if (!currentUser) {
      return; // Exit early - don't start payment process
    }

    setLoading(true);
    setError('');
    setPaymentStep('processing');

    try {
      // Get the current authentication token
      const idToken = await currentUser.getIdToken(true); // Force refresh to ensure token is valid
      const authHeader = { Authorization: `Bearer ${idToken}` };

      // Step 1: Save registration data in RTDB
      await axios.post(
        `${API_BASE_URL}/api/user/registrations`,
        {
          ...formData,
          timestamp: new Date().toISOString()
        },
        {
          headers: authHeader
        }
      );

      // Step 2: Create payment order with Razorpay
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/create-payment-order`,
        {},  // Empty body as server will get user info from Firebase
        {
          headers: authHeader
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create payment order');
      }

      // Get order ID and key from the response
      const { orderId, razorpayKey } = orderResponse.data;

      // Step 3: Load Razorpay script if not already loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Step 4: Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: 9900, // amount in paisa (99 INR)
        currency: "INR",
        name: "Inspiring Shereen",
        description: "Life-Changing Masterclass Registration",
        order_id: orderId,
        handler: async function (response) {
          try {
            setPaymentStep('success');

            // Handle successful payment
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            };

            // Verify payment with backend
            await axios.post(
              `${API_BASE_URL}/api/confirm-payment`,
              paymentData,
              {
                headers: authHeader
              }
            );

            // Update user's registration data in context (client-side)
            await updateUserRegistration({
              orderId,
              paymentId: response.razorpay_payment_id,
              amount: '₹99',
              paymentStatus: 'Confirmed',
              date: new Date().toISOString()
            });

            // Navigate to success page
            navigate('/success');
          } catch (error) {
            // Check if payment is actually confirmed despite the error
            try {
              const paymentStatus = await checkPaymentStatus(authHeader);
              if (paymentStatus.success) {
                // Payment is actually confirmed
                navigate('/success');
                return;
              }
            } catch (statusError) {
              console.error("Error checking payment status:", statusError);
            }

            setError("Payment was processed but confirmation failed. Please contact support.");
            setPaymentStep('error');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#7C3AED" // Violet color to match theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentStep('form');

            // Check if payment was successful despite modal being closed
            setTimeout(async () => {
              try {
                const idToken = await currentUser.getIdToken(true);
                const authHeader = { Authorization: `Bearer ${idToken}` };
                const paymentStatus = await checkPaymentStatus(authHeader);

                if (paymentStatus.success) {
                  navigate('/success');
                }
              } catch (error) {
                console.error("Error checking payment status after dismiss:", error);
              }
            }, 2000);
          }
        }
      };

      // Create Razorpay instance and open payment form
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred: ' + (err.response?.data?.error || err.message));
      setLoading(false);
      setPaymentStep('error');

      // Log error to server for debugging
      try {
        await axios.post(`${API_BASE_URL}/api/log-error`, {
          message: err.message,
          stack: err.stack,
          user: currentUser ? { id: currentUser.uid, email: currentUser.email } : null,
          context: 'payment_flow'
        });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }
  };

  // Helper function to check payment status
  const checkPaymentStatus = async (authHeader) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/check-payment`,
      { headers: authHeader }
    );
    return response.data;
  };

  return (
    <section id="register" className="relative py-20 overflow-hidden">
      {/* Background element */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-300/30 to-fuchsia-300/30 blur-3xl"
        style={{
          width: '50%',
          height: '50%',
          zIndex: 0
        }}
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 bg-violet-100 rounded-full mb-4">
            <span className="text-violet-700 font-semibold">Limited Time Offer</span>
          </div>

          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4">
            Register Now
          </h2>

          <div className="flex justify-center">
            <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full mb-6"></div>
          </div>

          <p className="text-lg text-gray-700 mb-4 max-w-md mx-auto">
            Join our life-changing masterclass and transform your life with clarity and confidence
          </p>

          <p className="font-bold text-2xl text-violet-600">
            Only ₹99 <span className="text-sm line-through text-gray-500">₹199</span>
            <span className="ml-2 inline-block bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-md font-semibold">
              50% OFF
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100 relative z-10"
        >
          {/* User status indicator */}
          {currentUser && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Signed in as {currentUser.email}
            </div>
          )}

          {/* Payment step indicators */}
          {paymentStep === 'processing' && !error && (
            <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Setting up payment... Please wait.
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Payment successful! Redirecting to confirmation page...
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>

          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                  placeholder="Your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                  placeholder="Your email address"
                  required
                  readOnly={currentUser !== null} // Make email readonly if user is logged in
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                  placeholder="Your phone number"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
                <button
                  className="block mt-2 text-red-700 underline"
                  onClick={() => {
                    setError('');
                    setPaymentStep('form');
                  }}
                  type="button"
                >
                  Try Again
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Register & Pay ₹99</span>
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}
            </motion.button>

            <p className="text-center text-gray-500 text-sm mt-4">
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure payment powered by Razorpay
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterForm;