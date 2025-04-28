// src/components/Features.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const featuresList = [
    {
      icon: "🔤",
      color: "from-blue-600 to-indigo-600",
      title: "Phonetic Mastery",
      description: "Learn to decode and pronounce English words correctly through systematic phonics instruction."
    },
    {
      icon: "🗣️",
      color: "from-teal-600 to-cyan-600",
      title: "Pronunciation Skills",
      description: "Perfect your English accent and speak with clarity and confidence in any situation."
    },
    {
      icon: "📚",
      color: "from-red-600 to-orange-600",
      title: "Vocabulary Building",
      description: "Expand your English vocabulary systematically through phonics-based word families."
    },
    {
      icon: "🎯",
      color: "from-green-600 to-emerald-600",
      title: "Reading Fluency",
      description: "Develop smooth, expressive reading skills that enhance comprehension and enjoyment."
    },
    {
      icon: "✍️",
      color: "from-indigo-600 to-purple-600",
      title: "Spelling Improvement",
      description: "Master English spelling patterns and rules through phonetic awareness training."
    },
    {
      icon: "💼",
      color: "from-blue-600 to-sky-600",
      title: "Professional Growth",
      description: "Enhance your career opportunities with improved English communication skills."
    }
  ];

  return (
    <section id="features" ref={ref} className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-300 to-cyan-300 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 font-medium mb-4">
            ENGLISH PHONICS MASTERY
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Transform Your English Pronunciation</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Comprehensive phonics training for learners of all ages to speak English with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:translate-y-[-10px] hover:shadow-xl transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-8">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 text-3xl bg-gradient-to-r ${feature.color} text-white transform transition-transform group-hover:scale-110 duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-xl hover:translate-y-1 transition-all duration-300"
            onClick={() => window.location.href = "/register"}
          >
            <span className="flex items-center">
              Enroll Now - Only ₹99
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;