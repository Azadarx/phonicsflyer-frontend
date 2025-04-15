// src/components/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState('cashfree');
  const [cashfreePaymentData, setCashfreePaymentData] = useState(null);
  const [loadingCashfree, setLoadingCashfree] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have a payment status from Cashfree redirect
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get('order_id');
    const referenceId = query.get('reference_id');

    if (orderId && referenceId) {
      // Only attempt to check status if there's a valid order ID
      if (orderId !== '{order_id}') {
        checkCashfreePaymentStatus(orderId, referenceId);
      } else {
        console.error('Invalid order ID received from callback');
        setError('Payment verification failed. Please try again or contact support.');
      }
    }
  }, [location]);

  // Check if payment data exists in session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    } else {
      // Redirect back to registration if payment data doesn't exist
      navigate('/');
    }
  }, [navigate]);

  const checkCashfreePaymentStatus = async (orderId, referenceId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status?orderId=${orderId}`);

      if (response.data.orderStatus === 'PAID') {
        // Payment is successful
        sessionStorage.setItem('referenceId', referenceId);
        navigate('/success');
      } else {
        // Payment failed or is pending
        setError('Payment was not completed. Please try again.');
        setShowPaymentOptions(true);
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError('Error verifying payment status. Please contact support.');
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePayNow = () => {
    if (selectedOption === 'cashfree') {
      handleCashfreePayment();
    } else {
      setShowPaymentOptions(false);
    }
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleConfirmPayment = async () => {
    if (!transactionId || transactionId.trim() === '') {
      setError('Please enter your transaction ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/confirm-payment`, {
        referenceId: paymentData.referenceId,
        transactionId: transactionId
      });

      if (response.data.success) {
        sessionStorage.setItem('referenceId', paymentData.referenceId);
        navigate('/success');
      } else {
        setError(response.data.error || 'Payment confirmation failed. Please contact support.');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError('An error occurred while confirming your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Cashfree payment
  const handleCashfreePayment = async () => {
    if (!paymentData || !paymentData.referenceId) {
      setError('Payment data is missing. Please register again.');
      return;
    }

    setLoadingCashfree(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment-order`, {
        referenceId: paymentData.referenceId
      });

      if (response.data.success) {
        setCashfreePaymentData(response.data);

        // For Cashfree Seamless Checkout, use their JS SDK
        if (window.Cashfree) {
          const cashfree = new window.Cashfree(response.data.appId);

          cashfree.checkout({
            paymentSessionId: response.data.paymentSessionId,
            returnUrl: `${window.location.origin}/payment?order_id={order_id}&reference_id=${paymentData.referenceId}`,
          });
        } else {
          // Fallback to form-based redirect if SDK isn't loaded
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://www.cashfree.com/checkout/post/submit';

          // Add the necessary fields
          const appendField = (name, value) => {
            const field = document.createElement('input');
            field.type = 'hidden';
            field.name = name;
            field.value = value;
            form.appendChild(field);
          };

          // Get the App ID from the response
          const appId = response.data.appId;

          appendField('appId', appId);
          appendField('orderId', response.data.orderId);
          appendField('orderAmount', '99');
          appendField('orderCurrency', 'INR');
          appendField('orderNote', 'Life Coaching Masterclass');
          appendField('customerName', paymentData.fullName || 'Customer');
          appendField('customerEmail', paymentData.email || 'customer@example.com');
          appendField('customerPhone', paymentData.phone || '1234567890');

          // Ensure we're using the full absolute URL for returnUrl
          const baseUrl = window.location.origin;
          appendField('returnUrl', `${baseUrl}/payment?order_id={order_id}&reference_id=${paymentData.referenceId}`);

          // Same for notify URL - use the backend URL
          appendField('notifyUrl', `${import.meta.env.VITE_API_BASE_URL}/api/cashfree-webhook`);

          appendField('paymentToken', response.data.orderToken);

          // Append the form to the document and submit it
          document.body.appendChild(form);
          form.submit();
        }
      } else {
        setError(response.data.error || 'Failed to initiate payment');
        setLoadingCashfree(false);
      }
    } catch (err) {
      console.error('Error creating payment order:', err);
      setError(err.response?.data?.error || 'Failed to initiate payment. Please try again.');
      setLoadingCashfree(false);
    }
  };

  // Generate UPI QR code URI - using placeholder UPI ID
  const getUpiQrLink = () => {
    return `upi://pay?pa=merchant@bank&pn=${encodeURIComponent('Merchant Name')}&am=99&cu=INR&tn=Masterclass`;
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Amount: <span className="font-bold text-purple-600">₹99</span></p>
            <p className="text-sm text-gray-500 mt-2">Reference ID: {paymentData.referenceId}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {showPaymentOptions ? (
            <>
              <div className="mb-8">
                <div className="flex flex-col space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50 bg-green-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      className="mr-3"
                      checked={selectedOption === 'cashfree'}
                      onChange={() => handleOptionChange('cashfree')}
                    />
                    <div className="flex items-center">
                      <img src="/cashfree-icon.png" alt="Cashfree" className="w-8 h-8 mr-3" onError={(e) => e.target.style.display = 'none'} />
                      <span className="font-medium">Pay with Cards, UPI, & More</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Recommended</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      className="mr-3"
                      checked={selectedOption === 'upi'}
                      onChange={() => handleOptionChange('upi')}
                    />
                    <div className="flex items-center">
                      <img src="/upi-icon.png" alt="UPI" className="w-8 h-8 mr-3" onError={(e) => e.target.style.display = 'none'} />
                      <span className="font-medium">UPI QR Code</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      className="mr-3"
                      checked={selectedOption === 'netbanking'}
                      onChange={() => handleOptionChange('netbanking')}
                    />
                    <span className="font-medium">Netbanking</span>
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePayNow}
                disabled={loadingCashfree}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
              >
                {loadingCashfree ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Continue'
                )}
              </motion.button>
            </>
          ) : (
            <>
              <div className="mb-8">
                {selectedOption === 'upi' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Pay via UPI</h3>
                      <p className="text-gray-600 mt-2">Scan this QR code with any UPI app</p>
                    </div>

                    <div className="flex flex-col items-center mb-6">
                      {/* QR Code */}
                      <div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getUpiQrLink())}`}
                          alt="UPI QR Code"
                          className="w-48 h-48"
                        />
                      </div>

                      <div className="w-full bg-white p-4 rounded-lg shadow-sm">
                        <p className="font-medium text-gray-700">UPI ID: <span className="text-black">merchant@bank</span></p>
                        <p className="font-medium text-gray-700 mt-2">Name: <span className="text-black">Merchant Name</span></p>
                        <p className="font-medium text-gray-700 mt-2">Amount: <span className="text-black">₹99</span></p>
                      </div>

                      <p className="text-sm text-gray-600 mt-4 mb-6">
                        After completing payment, enter your transaction ID to confirm
                      </p>

                      <div className="w-full">
                        <input
                          type="text"
                          value={transactionId}
                          onChange={handleTransactionIdChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
                          placeholder="Enter your Transaction ID"
                        />

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleConfirmPayment}
                          disabled={loading}
                          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying...
                            </>
                          ) : (
                            'Confirm Payment'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOption === 'netbanking' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Pay via Netbanking</h3>
                      <p className="text-gray-600 mt-2">Direct bank transfer details</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <p className="font-medium text-gray-700">Bank Name: <span className="text-black">Bank Name</span></p>
                      <p className="font-medium text-gray-700 mt-2">Account Number: <span className="text-black">XXXXXXXXXXXX</span></p>
                      <p className="font-medium text-gray-700 mt-2">IFSC Code: <span className="text-black">BANK0000001</span></p>
                      <p className="font-medium text-gray-700 mt-2">Account Name: <span className="text-black">Merchant Name</span></p>
                      <p className="font-medium text-gray-700 mt-2">Amount: <span className="text-black">₹99</span></p>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                      After completing payment, enter your transaction ID to confirm
                    </p>

                    <div className="w-full">
                      <input
                        type="text"
                        value={transactionId}
                        onChange={handleTransactionIdChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
                        placeholder="Enter your Transaction ID"
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleConfirmPayment}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          'Confirm Payment'
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowPaymentOptions(true)}
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Payment Options
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;