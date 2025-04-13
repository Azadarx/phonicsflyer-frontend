 // src/components/About.jsx
import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About The Masterclass</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            This is not just motivation, It's real coaching, real breakthroughs, and real transformation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-purple-50 p-6 rounded-lg shadow-md"
          >
            <div className="text-purple-600 text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Real Transformation</h3>
            <p className="text-gray-600">
              This webinar will cover ultimate knowledge on Health, Life and Business Mastery for Holistic Success.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-purple-50 p-6 rounded-lg shadow-md"
          >
            <div className="text-purple-600 text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Actionable Knowledge</h3>
            <p className="text-gray-600">
              You'll get to know WHAT to do, HOW to do, WHY to do - To Earn Money in your life.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-purple-50 p-6 rounded-lg shadow-md"
          >
            <div className="text-purple-600 text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Interactive Session</h3>
            <p className="text-gray-600">
              Live on Zoom (Interactive + Reflective Exercises) on 19th April at 11:30 AM.
            </p>
          </motion.div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center mt-12"
        >
          <button 
            className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-purple-700 transition-all duration-300"
            onClick={() => window.location.href = "/register"}
          >
            Enroll Now - Only ₹99
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
