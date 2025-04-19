// src/components/PaymentCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentCallback = () => {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract payment details from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const razorpay_payment_id = urlParams.get('razorpay_payment_id');
    const razorpay_order_id = urlParams.get('razorpay_order_id');
    const razorpay_signature = urlParams.get('razorpay_signature');
    
    // Get reference ID from storage
    const referenceId = sessionStorage.getItem('referenceId') || 
                       localStorage.getItem('referenceId');
    
    if (!referenceId) {
      console.error('No reference ID found');
      setStatus('error');
      // Redirect to failed page after a short delay
      setTimeout(() => {
        navigate('/payment-failed?reason=missing_reference');
      }, 2000);
      return;
    }
    
    // Verify if we have all payment parameters
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      // Verify payment with backend
      const paymentData = {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        referenceId
      };
      
      axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/confirm-payment`,
        paymentData
      )
      .then(result => {
        console.log('Payment confirmation success:', result.data);
        setStatus('success');
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/success?refId=${referenceId}`);
        }, 2000);
      })
      .catch(err => {
        console.error("Error confirming payment:", err);
        setStatus('error');
        // Redirect to failed page after a short delay
        setTimeout(() => {
          navigate(`/payment-failed?refId=${referenceId}&reason=verification_failed`);
        }, 2000);
      });
    } else {
      // If payment parameters are missing, check if payment was already confirmed
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/check-payment?reference_id=${referenceId}`)
        .then(response => {
          if (response.data.success) {
            setStatus('success');
            // Redirect to success page after a short delay
            setTimeout(() => {
              navigate(`/success?refId=${referenceId}`);
            }, 2000);
          } else {
            setStatus('error');
            // Redirect to failed page after a short delay
            setTimeout(() => {
              navigate(`/payment-failed?refId=${referenceId}&reason=incomplete`);
            }, 2000);
          }
        })
        .catch(() => {
          setStatus('error');
          // Redirect to failed page after a short delay
          setTimeout(() => {
            navigate(`/payment-failed?refId=${referenceId}&reason=server_error`);
          }, 2000);
        });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="py-8">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {status === 'processing' && "Processing your payment..."}
            {status === 'success' && "Payment successful! Redirecting..."}
            {status === 'error' && "Verifying payment status..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">Please don't close this window</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;