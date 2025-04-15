// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Active form step tracker
  const [formStep, setFormStep] = useState(0);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

  const advanceStep = (e) => {
    e.preventDefault();
    setFormStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Register the user and get reference ID
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        formData
      );

      if (!registerResponse.data.success) {
        throw new Error('Registration failed');
      }

      const { referenceId } = registerResponse.data;

      // Step 2: Create payment order with Razorpay
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-payment-order`,
        { referenceId }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      // Save reference ID in session storage for later use
      sessionStorage.setItem('referenceId', referenceId);

      // Get order ID and key from the response
      const { orderId, razorpayKey } = orderResponse.data;

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Initialize Razorpay options
      const options = {
        key: razorpayKey,
        amount: 9900, // amount in paisa (99 INR)
        currency: "INR",
        name: "Inspiring Shereen",
        description: "Life-Changing Masterclass Registration",
        order_id: orderId,
        handler: function (response) {
          // Handle successful payment
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            referenceId: referenceId
          };

          // Verify payment with backend
          axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/confirm-payment`,
            paymentData
          ).catch(err => console.error("Error confirming payment:", err));

          navigate('/success');
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#7C3AED" // Purple color to match your theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log('Payment cancelled');
          }
        }
      };

      // Create Razorpay instance and open payment form
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('Registration/payment error:', err);
      setError('An error occurred: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  // Animated background elements
  const backgrounds = [
    { top: '10%', left: '5%', size: 200, delay: 0 },
    { top: '30%', right: '10%', size: 150, delay: 1 },
    { top: '70%', left: '15%', size: 180, delay: 2 },
    { top: '85%', right: '5%', size: 120, delay: 3 },
  ];

  return (
    <section id="register" className="relative py-20 overflow-hidden">
      {/* Animated background elements */}
      {backgrounds.map((bg, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 blur-3xl"
          style={{
            top: bg.top,
            left: bg.left,
            right: bg.right,
            width: bg.size,
            height: bg.size,
            zIndex: 0
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            delay: bg.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-purple-100 rounded-full mb-4"
          >
            <span className="text-purple-700 font-semibold">Limited Time Offer</span>
          </motion.div>

          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            Register Now
          </h2>

          <div className="flex justify-center">
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mb-6"></div>
          </div>

          <p className="text-lg text-gray-700 mb-4 max-w-md mx-auto">
            Join our life-changing masterclass and transform your life with clarity and confidence
          </p>

          <p className="font-bold text-2xl text-purple-600">
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
          className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 relative z-10"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>

          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <motion.form onSubmit={formStep === 0 ? advanceStep : handleSubmit}>
            {/* Step indicator */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  animate={formStep >= 0 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  1
                </motion.div>
                <div className={`h-1 w-12 mx-1 ${formStep >= 1 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  animate={formStep >= 1 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  2
                </motion.div>
              </div>
              <span className="text-sm text-gray-500">
                {formStep === 0 ? 'Personal Details' : 'Payment'}
              </span>
            </div>

            {formStep === 0 ? (
              /* Step 1: Personal Details */
              <>
                <motion.div variants={itemVariants} className="mb-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-8">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center"
                >
                  Continue to Payment
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </>
            ) : (
              /* Step 2: Payment Details */
              <>
                <motion.div variants={itemVariants} className="bg-purple-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">Registration Summary</h3>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="border-t border-purple-200 my-3 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-purple-700">₹99</span>
                    </div>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  </motion.div>
                )}

                <div className="flex space-x-4">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setFormStep(0)}
                    className="w-1/3 bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-medium text-base transition-all duration-300"
                  >
                    Back
                  </motion.button>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹99 Now
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}

            {/* Security badges */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-100 flex justify-center space-x-6"
            >
              <div className="text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Payment
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SSL Encrypted
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Secure
              </div>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Floating particles / decorative elements */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.5,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default RegisterForm;