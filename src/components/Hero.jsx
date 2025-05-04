// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/heroImg.jpg'; 

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-teal-300 to-emerald-300 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text content */}
          <div className="md:col-span-7 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent text-lg font-medium mb-2 block">
                TRANSFORM YOUR LEARNING JOURNEY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4"
            >
              Master <span className="relative">
                <span className="relative z-10">Phonics English</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-teal-300 to-blue-300 opacity-60 -rotate-1"></span>
              </span> at Any Age
            </motion.h1>

            <div className="w-24 h-2 bg-gradient-to-r from-teal-600 to-blue-600 mb-6 md:mx-0 mx-auto rounded-full"></div>

            <h2 className="text-2xl font-bold text-teal-600 mb-4">
              Expert coaching in Phonics English and Life Skills
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Join our specialized courses by Mrs. Shereen with over 15 years of experience in the education industry. Perfect for both students and adults looking to enhance their language skills.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(13, 148, 136, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:translate-y-1 transition-all duration-300 w-full sm:w-auto"
                onClick={() => window.location.href = "/register"}
              >
                <span className="flex items-center justify-center">
                  Enroll Now - Only ₹99
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </motion.button>
              <span className="text-gray-600 flex items-center">
                <span className="line-through mr-2">Actual Fee: ₹199</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-semibold">50% OFF</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Certified Courses</span>
              </div>

              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Personalized Learning Plans</span>
              </div>

              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Trusted by Parents & Students</span>
              </div>
            </motion.div>
          </div>

          {/* Image container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-5 relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 border-4 border-white">
                <img
                  src={heroImg}
                  alt="Phonics English Learning"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Feature cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg z-20 transform rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center">👨‍👩‍👧‍👦</div>
                  <div>
                    <div className="font-bold text-teal-700">All Ages</div>
                    <div className="text-sm text-gray-600">Kids to Adults</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg z-20 transform -rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center">🎓</div>
                  <div>
                    <div className="font-bold text-teal-700">Expert Teaching</div>
                    <div className="text-sm text-gray-600">15+ Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;