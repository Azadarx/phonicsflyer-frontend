// src/components/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState('upi');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if payment data exists in session storage
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    } else {
      // Redirect back to registration if payment data doesn't exist
      navigate('/');
    }
  }, [navigate]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePayNow = () => {
    setShowPaymentOptions(false);
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
        // Store reference ID for success page
        sessionStorage.setItem('referenceId', paymentData.referenceId);
        // Navigate to success page
        navigate('/success');
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError('An error occurred while confirming your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate UPI QR code URI
  const getUpiQrLink = () => {
    if (!paymentData) return '';
    const { paymentDetails } = paymentData;
    return `upi://pay?pa=${paymentDetails.upiId}&pn=${encodeURIComponent(paymentDetails.name)}&am=${paymentDetails.amount}&cu=${paymentDetails.currency}&tn=Masterclass`;
  };

  // Generate UPI Intent Link
  const getUpiIntentLink = () => {
    return `upi://pay?pa=9494100110@yesbank&pn=${encodeURIComponent('Inspiring Shereen')}&am=1&cu=INR&tn=Masterclass`;
  };

  // Function to open UPI app
  const openUpiApp = () => {
    window.location.href = getUpiIntentLink();
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

          {showPaymentOptions ? (
            <>
              <div className="mb-8">
                <div className="flex flex-col space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      className="mr-3"
                      checked={selectedOption === 'upiApp'}
                      onChange={() => handleOptionChange('upiApp')}
                    />
                    <div className="flex items-center">
                      <img src="/upi-icon.png" alt="UPI" className="w-8 h-8 mr-3" onError={(e) => e.target.style.display = 'none'} />
                      <span className="font-medium">Pay using UPI Apps</span>
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
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      className="mr-3"
                      checked={selectedOption === 'card'}
                      onChange={() => handleOptionChange('card')}
                    />
                    <span className="font-medium">Debit/Credit Card</span>
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePayNow}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300"
              >
                Continue
              </motion.button>
            </>
          ) : (
            <>
              <div className="mb-8">
                {selectedOption === 'upiApp' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Pay using UPI App</h3>
                      <p className="text-gray-600 mt-2">Click the button below to open your UPI app</p>
                    </div>
                    
                    <div className="flex justify-center mb-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openUpiApp}
                        className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium shadow-md hover:bg-green-700 transition-all duration-300 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Pay ₹1 Now
                      </motion.button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        This will open your UPI payment apps installed on your device
                      </p>
                      <div className="mt-4">
                        <p className="font-medium">UPI ID</p>
                        <div className="flex items-center justify-center mt-1">
                          <span className="bg-white border px-4 py-2 rounded">9494100110@yesbank</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="font-medium">Name</p>
                        <p className="mt-1">Inspiring Shereen</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedOption === 'upi' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Pay via UPI</h3>
                      <p className="text-gray-600 mt-2">Scan the QR code or use the UPI ID below</p>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      <img 
                        src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(getUpiQrLink())}&chs=200x200`} 
                        alt="UPI QR Code" 
                        className="border p-2 bg-white rounded-lg"
                      />
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="font-medium">UPI ID</p>
                      <div className="flex items-center justify-center mt-1">
                        <span className="bg-white border px-4 py-2 rounded">{paymentData.paymentDetails.upiId}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium">Name</p>
                      <p className="mt-1">{paymentData.paymentDetails.name}</p>
                    </div>
                  </div>
                )}
                
                {selectedOption === 'netbanking' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Net Banking Details</h3>
                      <p className="text-gray-600 mt-2">Transfer ₹99 to the following account</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium">Inspiring Shereen</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">Yes Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UPI ID:</span>
                        <span className="font-medium">{paymentData.paymentDetails.upiId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">₹99</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedOption === 'card' && (
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="font-medium text-lg text-gray-800">Card Payment</h3>
                      <p className="text-gray-600 mt-2">Pay using UPI apps that support card payments</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="mb-4">Use any UPI app to pay to:</p>
                      <div className="flex items-center justify-center mt-1">
                        <span className="bg-white border px-4 py-2 rounded">{paymentData.paymentDetails.upiId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="transactionId" className="block text-gray-700 font-medium mb-2">
                  Transaction ID or Reference Number
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={handleTransactionIdChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter your transaction ID after payment"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please enter the transaction ID or reference number from your payment
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;