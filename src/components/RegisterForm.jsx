import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { handlePaymentSuccess } from '../utils/paymentHandlers';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    couponCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'error'
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // Simple mock coupon validation - in production, this would call an API
    if (formData.couponCode.toUpperCase() === 'PHONICS20') {
      setDiscountApplied(true);
    } else {
      setError('Invalid coupon code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setPaymentStep('processing');

    try {
      // Format the data for registration
      const registrationData = {
        ...formData,
        courseName: 'Phonics English Course',
        courseLevel: 'Beginner',
        courseDuration: '3 months',
        timestamp: new Date().toISOString()
      };

      // Step 1: Save registration data in RTDB (now without auth token)
      const registrationResponse = await axios.post(
        `${API_BASE_URL}/api/user/registrations`,
        registrationData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!registrationResponse.data.success && registrationResponse.data.error) {
        throw new Error(registrationResponse.data.error || 'Failed to save registration data');
      }

      // Step 2: Create payment order with Razorpay (no auth required)
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/create-payment-order`,
        {
          email: formData.email,
          discountApplied,
          amount: discountApplied ? 7900 : 9900, // Pass amount explicitly (in paisa)
          currency: "INR",
          notes: {
            courseName: 'Phonics English Course',
            userEmail: formData.email,
            discount: discountApplied ? '20%' : 'none'
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create payment order');
      }

      // Get order ID and key from the response
      const { orderId, razorpayKey, amount, currency } = orderResponse.data;

      // Step 3: Load Razorpay script if not already loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Step 4: Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: discountApplied ? 7900 : 9900, // amount in paisa (99 INR or 79 INR with discount)
        currency: "INR",
        name: "Inspiring Shereen",
        description: "Phonics English Course Registration",
        order_id: orderId,
        handler: async function (response) {
          try {
            setPaymentStep('success');
            console.log("Payment succeeded, processing...");

            // Handle successful payment
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            };

            // Verify payment with backend - but don't wait for it to complete
            // This prevents delays in showing the success screen
            const verifyPromise = axios.post(
              `${API_BASE_URL}/api/confirm-payment`,
              paymentData,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            // Also don't wait for this either - do it in parallel
            const updatePromise = axios.post(
              `${API_BASE_URL}/api/update-registration`,
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                email: formData.email,
                amount: discountApplied ? '₹79' : '₹99',
                paymentStatus: 'Confirmed',
                date: new Date().toISOString()
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            // Use the utility function to handle redirection properly
            const userDataToStore = {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone
            };

            // Redirect to success immediately while the operations happen in background
            handlePaymentSuccess(response.razorpay_order_id, userDataToStore);

            // Try to complete operations in background
            Promise.all([verifyPromise, updatePromise])
              .catch(error => console.error("Background payment operations error:", error));

          } catch (error) {
            console.error("Payment handler error:", error);

            // Even if there's an error, try redirecting to success page
            // since Razorpay already showed success
            try {
              const userDataToStore = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
              };
              handlePaymentSuccess(response.razorpay_order_id, userDataToStore);
            } catch (redirectError) {
              console.error("Redirect error:", redirectError);
              // Last resort direct navigation
              window.location.href = "/success?manual=true";
            }
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#2563EB" // Blue color to match theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentStep('form');

            // Check if payment was successful despite modal being closed
            setTimeout(async () => {
              try {
                const paymentStatus = await checkPaymentStatus(formData.email);

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
          user: { email: formData.email },
          context: 'payment_flow'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }
  };

  // Helper function to check payment status
  const checkPaymentStatus = async (email) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/check-payment?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };

  return (
    <section id="register" className="relative py-16 overflow-hidden">
      {/* Background element */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300/30 to-cyan-300/30 blur-3xl"
        style={{
          width: '50%',
          height: '50%',
          zIndex: 0
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center">
          {/* Centered Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-700 font-semibold">Limited Time Offer</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">
                Join Our Phonics English Course
              </h2>

              <div className="flex justify-center">
                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-6"></div>
              </div>

              <p className="text-base sm:text-lg text-gray-700 mb-4 max-w-md mx-auto">
                Master English pronunciation with our comprehensive phonics approach for learners of all ages
              </p>
            </div>

            <motion.div
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-blue-100 relative z-10"
            >
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
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>

              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-blue-800 mb-6">Personal Information</h3>

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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Your email address"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
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
                      <span>Continue to Payment</span>
                      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  )}
                </motion.button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Your payment is securely processed by RazorPay.
                </p>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;