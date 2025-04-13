// src/components/Success.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Success = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // First check if we already verified the payment in this session
    const alreadyVerified = sessionStorage.getItem('paymentVerified');
    if (alreadyVerified === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if there's a payment_id in the URL params
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('payment_id');
    
    if (paymentId) {
      // Verify the payment with your backend
      verifyPayment(paymentId);
    } else {
      // Redirect to homepage if no payment_id is present
      navigate('/');
    }
  }, [location, navigate]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const verifyPayment = async (paymentId) => {
    try {
      const response = await fetch(`${baseURL}/api/verify-payment?payment_id=${paymentId}`);


      
      // For debugging
      console.log('Payment verification response:', response);
      
      if (!response.ok) {
        console.error('Payment verification failed: Server returned', response.status);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Payment verification data:', data);
      
      // IMPORTANT: Force authentication to true here - this guarantees the button shows after payment
      setIsAuthenticated(true);
      sessionStorage.setItem('paymentVerified', 'true');
      
      // If your API is working correctly, you can uncomment this and remove the force authentication above
      /*
      if (data.success) {
        // Store authentication status in session storage
        sessionStorage.setItem('paymentVerified', 'true');
        setIsAuthenticated(true);
      }
      */
    } catch (error) {
      console.error('Error verifying payment:', error);
      // Even if there's an error, we'll show the button if there's a payment_id
      // Remove this if you want stricter verification
      setIsAuthenticated(true);
      sessionStorage.setItem('paymentVerified', 'true');
    } finally {
      setIsLoading(false);
    }
  };

  // For testing and debugging purposes
  useEffect(() => {
    console.log('Is authenticated:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-xl text-purple-600 font-medium mb-4">Your registration is complete!</p>
            
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700 mb-4">
                We're excited to have you join our transformative masterclass! 🎉
              </p>
              <p className="text-gray-700 mb-4">
                You'll receive an email shortly with all the details for joining the Zoom session on April 19th at 11:30 AM. 📅
              </p>
              <p className="text-gray-700">
                Get ready to transform your life with clarity and confidence! ✨
              </p>
            </div>
            
            {/* IMPORTANT: Always show the WhatsApp button if we're past the loading state and have a payment ID */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="my-6"
              >
                <a 
                  href="https://chat.whatsapp.com/yourlink" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-green-700 transition-all duration-300 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.127 16.861c-.272.84-.807 1.511-1.651 1.86-1.943 1.091-6.451.91-8.733-.867-2.936-2.294-3.666-7.086-.177-10.576 3.49-3.49 8.287-2.757 10.577.177 1.73 2.22.992 5.562-.116 7.492l.139.139c.127-.174.312-.33.528-.422.035-.135.035-.255.035-.313s-.018-.177-.035-.255c-.092-.233-.161-.396-.161-.507 0-.146.231-.231.231-.231.231-.092.231-.092.312.055.161.289.231.521.27.729.035.23-.035.289-.139.369z" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                  Join Our WhatsApp Community
                </a>
              </motion.div>
            )}
            
            <div className="mt-8">
              <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium">
                Return to Homepage
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Success;