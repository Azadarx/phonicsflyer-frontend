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
          ondismiss: function() {
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

  return (
    <section id="register" className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Register Now</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 mb-4">
            Join our live masterclass and transform your life
          </p>
          <p className="font-medium text-purple-600">
            Only ₹99 (Limited Time Offer!)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your email address"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your phone number"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
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
                'Continue to Payment - ₹99 Only'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterForm;