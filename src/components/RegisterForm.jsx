import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { handlePaymentSuccess } from '../utils/paymentHandlers'
import Select from "react-select";
import { Country, State, City } from "country-state-city";


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    couponCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'error'
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateUserRegistration } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Define customStyles here so it's available throughout the component
  const customStyles = {
    control: (base) => ({
      ...base,
      padding: '2px',
      borderRadius: '0.5rem',
      borderColor: '#e2e8f0',
      boxShadow: 'none',
      minHeight: '46px',
      '&:hover': {
        borderColor: '#a5b4fc'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.375rem',
      overflow: 'hidden'
    }),
    container: (base) => ({
      ...base,
      width: '100%'
    })
  };

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData({
        ...formData,
        fullName: currentUser.displayName || formData.fullName,
        email: currentUser.email || formData.email,
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

  // Add the missing handler functions
  const handleCountryChange = (selectedCountry) => {
    setFormData({
      ...formData,
      country: selectedCountry,
      state: '',
      city: ''
    });
  };

  const handleStateChange = (selectedState) => {
    setFormData({
      ...formData,
      state: selectedState,
      city: ''
    });
  };

  const handleCityChange = (selectedCity) => {
    setFormData({
      ...formData,
      city: selectedCity.value
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
          courseName: 'Phonics English Course',
          courseLevel: 'Beginner',
          courseDuration: '3 months',
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
                headers: authHeader
              }
            );

            // Also don't wait for this either - do it in parallel
            const updatePromise = updateUserRegistration(response.razorpay_order_id, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: '₹99',
              paymentStatus: 'Confirmed',
              date: new Date().toISOString()
            });

            // Use the utility function to handle redirection properly
            const userDataToStore = {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              country: formData.country.name,
              state: formData.state.name,
              city: formData.city
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
                phone: formData.phone,
                country: formData.country.name,
                state: formData.state.name,
                city: formData.city
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/3"
          >
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-700 font-semibold">Limited Time Offer</span>
              </div>

              <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">
                Join Our Phonics English Course
              </h2>

              <div className="flex justify-center">
                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-6"></div>
              </div>

              <p className="text-lg text-gray-700 mb-4 max-w-md mx-auto">
                Master English pronunciation with our comprehensive phonics approach for learners of all ages
              </p>
            </div>

            <motion.div
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 relative z-10"
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
                      readOnly={currentUser !== null}
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

                <div className="mb-6">
                  <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <Select
                      id="country"
                      name="country"
                      options={Country.getAllCountries().map(country => ({
                        value: country.isoCode,
                        label: country.name,
                        ...country
                      }))}
                      value={formData.country}
                      onChange={handleCountryChange}
                      placeholder="Select Country"
                      isDisabled={loading}
                      className="w-full pl-10"
                      classNamePrefix="select"
                      isClearable
                      isSearchable
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State/Province</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <Select
                      id="state"
                      name="state"
                      options={formData.country
                        ? State.getStatesOfCountry(formData.country.isoCode).map(state => ({
                          value: state.isoCode,
                          label: state.name,
                          ...state
                        }))
                        : []
                      }
                      value={formData.state}
                      onChange={handleStateChange}
                      placeholder={formData.country ? "Select State/Province" : "Please select a country first"}
                      isDisabled={!formData.country || loading}
                      className="w-full pl-10"
                      classNamePrefix="select"
                      isClearable
                      noOptionsMessage={() => formData.country ? "No states/provinces found" : "Select a country first"}
                      styles={customStyles}
                    />
                  </div>
                  {formData.country && State.getStatesOfCountry(formData.country.isoCode).length === 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      No states/provinces available for the selected country
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    {formData.country && formData.state ? (
                      <Select
                        id="city"
                        name="city"
                        options={City.getCitiesOfState(formData.country.isoCode, formData.state.isoCode).map(city => ({
                          value: city.name,
                          label: city.name
                        }))}
                        value={formData.city ? { label: formData.city, value: formData.city } : null}
                        onChange={handleCityChange}
                        placeholder="Select City"
                        isDisabled={!formData.state || loading}
                        className="w-full pl-10"
                        classNamePrefix="select"
                        isClearable
                        noOptionsMessage={() => "No cities found for this state/province"}
                        styles={customStyles}
                      />
                    ) : (
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder={formData.state ? "Enter city name" : "Please select a state first"}
                        disabled={!formData.state || loading}
                      />
                    )}
                  </div>
                  {formData.state && formData.country && City.getCitiesOfState(formData.country.isoCode, formData.state.isoCode).length === 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      No city database available for this state. Please enter your city manually.
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <label htmlFor="couponCode" className="block text-gray-700 font-medium mb-2">Coupon Code</label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="couponCode"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Enter coupon code if you have one"
                        disabled={loading || discountApplied}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!formData.couponCode || loading || discountApplied}
                      className="ml-2 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Coupon applied! 20% discount activated.
                    </p>
                  )}
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

          {/* Right Column - Course Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 sticky top-6">
              <h3 className="text-xl font-bold text-blue-800 mb-6">Course Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Course</span>
                  <span className="font-medium">Phonics English Course</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">Beginner</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">3 months</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Original Price</span>
                  <span className="font-medium">₹99</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">20% OFF</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-800">Total Price</span>
                  <span className="text-xl font-bold text-blue-700">
                    ₹{discountApplied ? '79' : '99'}
                  </span>
                </div>
              </div>

              <div className="space-y-5 mt-8">
                <h4 className="font-bold text-gray-800">Why Choose Our Phonics English Course?</h4>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-gray-800">Expert Instructors</h5>
                    <p className="text-xs text-gray-500">Learn from certified specialists with years of teaching experience.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-gray-800">Interactive Learning</h5>
                    <p className="text-xs text-gray-500">Engage with fun activities, games, and exercises designed to make learning enjoyable.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-gray-800">Rapid Progress</h5>
                    <p className="text-xs text-gray-500">Our proven method helps students improve their skills fast.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-gray-800">Certificate Included</h5>
                    <p className="text-xs text-gray-500">Receive a verified certificate upon course completion.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        SJ
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600 italic">
                        "I've shown remarkable improvement in my English skills since joining this course. The interactive approach keeps me engaged and excited about learning. Highly recommended!"
                      </p>
                      <p className="text-xs font-medium text-gray-700 mt-2">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;