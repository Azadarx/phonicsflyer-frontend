// src/components/Pricing.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
      {/* Reduced to just one animated background element */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute top-20 left-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"
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
            <h2 className="text-4xl font-bold text-gray-800 relative z-10">Special Offer</h2>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Take advantage of our limited-time discounted pricing on our most popular phonics course
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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border-t-4 border-blue-600">
              {/* Wavy pattern at the top */}
              <div className="h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
                  <path fill="#ffffff" fillOpacity="1" d="M0,96L40,112C80,128,160,160,240,160C320,160,400,128,480,112C560,96,640,96,720,112C800,128,880,160,960,165.3C1040,171,1120,149,1200,149.3C1280,149,1360,171,1400,181.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                </svg>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Phonics Masterclass</h3>
                    <p className="text-blue-600 font-medium">Limited seats available!</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-lg">₹199</span>
                    <div className="text-3xl font-extrabold text-blue-600">₹99</div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center bg-blue-50 p-4 rounded-xl">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">START DATE</div>
                      <div className="text-gray-700 font-bold">15th May 2025</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-cyan-50 p-4 rounded-xl">
                    <div className="bg-cyan-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">CLASS SCHEDULE</div>
                      <div className="text-gray-700 font-bold">Weekends, 10:00 AM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-teal-50 p-4 rounded-xl">
                    <div className="bg-teal-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">FORMAT</div>
                      <div className="text-gray-700 font-bold">Online Live Classes</div>
                      <div className="text-xs text-gray-500">Interactive sessions + Practice materials</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-sky-50 p-4 rounded-xl">
                    <div className="bg-sky-100 rounded-full p-2 mr-4">
                      <svg className="h-6 w-6 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">COURSE INCLUDES</div>
                      <div className="text-gray-700 font-bold">12 Lessons + Study Materials</div>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
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
                      Offer ends soon – Reserve your spot today!
                    </span>
                  </p>
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mt-2">
                    Transform your English learning journey now
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