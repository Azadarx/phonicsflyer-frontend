// src/components/About.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const About = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-violet-300 to-fuchsia-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-lg font-medium mb-2 block">
              TRANSCEND LIMITS
            </span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-4">
            About The Masterclass
          </motion.h2>
          
          <motion.div variants={itemVariants} className="w-24 h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 mx-auto mb-8 rounded-full"></motion.div>
          
          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-xl text-gray-600">
            This is not just motivation, It's real coaching, real breakthroughs, and real transformation.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              color: "from-violet-500 to-purple-500",
              title: "Real Transformation",
              description: "This webinar will cover ultimate knowledge on Health, Life and Business Mastery for Holistic Success."
            },
            {
              icon: "🔑",
              color: "from-fuchsia-500 to-pink-500",
              title: "Actionable Knowledge",
              description: "You'll get to know WHAT to do, HOW to do, WHY to do - To Earn Money in your life."
            },
            {
              icon: "📍",
              color: "from-pink-500 to-rose-500",
              title: "Interactive Session",
              description: "Live on Zoom (Interactive + Reflective Exercises) on 19th April at 11:30 AM."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:scale-105"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 h-full overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-full"></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${item.color} text-white text-3xl shadow-lg`}>
                    <span className="transform transition-transform group-hover:scale-110 duration-300">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center mt-16">
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(112, 26, 117, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-lg hover:translate-y-1 transition-all duration-300"
            onClick={() => window.location.href = "/register"}
          >
            <span className="flex items-center justify-center">
              Enroll Now - Only ₹99
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;