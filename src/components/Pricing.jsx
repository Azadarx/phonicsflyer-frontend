// src/components/Pricing.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Reduced to just one animated background element */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute top-20 left-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative mb-4">
            <h2 className="text-4xl font-bold text-gray-800 relative z-10">Event Details</h2>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Secure your spot at our transformative masterclass and begin your journey to a more fulfilled life today.
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <div className="relative">
            {/* Decorative element preserved but simplified */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-100 rounded-lg shadow-lg flex items-center justify-center transform rotate-12 z-20 border-2 border-yellow-300">
              <div className="text-center">
                <div className="text-yellow-500 text-lg font-bold">50%</div>
                <div className="text-gray-700 font-medium text-sm">OFF</div>
              </div>
            </div>

            {/* Main card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border-t-4 border-purple-600">
              {/* Wavy pattern at the top */}
              <div className="h-12 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
                  <path fill="#ffffff" fillOpacity="1" d="M0,96L40,112C80,128,160,160,240,160C320,160,400,128,480,112C560,96,640,96,720,112C800,128,880,160,960,165.3C1040,171,1120,149,1200,149.3C1280,149,1360,171,1400,181.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                </svg>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Life-Changing Masterclass</h3>
                    <p className="text-purple-600 font-medium">Limited seats available!</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-lg">₹199</span>
                    <div className="text-3xl font-extrabold text-purple-600">₹99</div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center bg-purple-50 p-4 rounded-xl">
                    <div className="bg-purple-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">DATE</div>
                      <div className="text-gray-700 font-bold">19th April</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-fuchsia-50 p-4 rounded-xl">
                    <div className="bg-fuchsia-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-fuchsia-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">TIME</div>
                      <div className="text-gray-700 font-bold">11:30 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-pink-50 p-4 rounded-xl">
                    <div className="bg-pink-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">LOCATION</div>
                      <div className="text-gray-700 font-bold">Live on Zoom</div>
                      <div className="text-xs text-gray-500">Interactive + Reflective Exercises</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-indigo-50 p-4 rounded-xl">
                    <div className="bg-indigo-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">DURATION</div>
                      <div className="text-gray-700 font-bold">3-Hour Comprehensive Session</div>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  onClick={() => window.location.href = "/register"}
                >
                  <span className="mr-2">Enroll Now - Only ₹99</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </motion.button>
                
                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-1">
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm font-medium">
                      Seats Are Limited – Reserve Yours Now!
                    </span>
                  </p>
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
                    Do it now. Your future self is waiting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;