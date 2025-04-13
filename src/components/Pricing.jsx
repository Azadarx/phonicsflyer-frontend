// src/components/Pricing.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Event Details</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto bg-purple-50 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Life-Changing Masterclass</h3>
                <p className="text-purple-600 font-medium">Limited seats available!</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 line-through">₹199</span>
                <div className="text-3xl font-bold text-purple-600">₹99</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 9900-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">📅 DATE: 19th April</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 9900-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">🕦 TIME: 11:30 AM</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 9900-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">📍 Live on Zoom (Interactive + Reflective Exercises)</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 9900-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">3-Hour Comprehensive Session</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300"
              onClick={() => window.location.href = "/register"}
            >
              Enroll Now - Only ₹99
            </motion.button>
            
            <p className="text-center text-gray-600 mt-4">
              Seats Are Limited – Reserve Yours Now!
            </p>
            <p className="text-center font-medium text-purple-600 mt-2">
              Do it now. Your future self is waiting.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;