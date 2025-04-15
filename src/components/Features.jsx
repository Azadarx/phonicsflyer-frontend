// src/components/Features.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const featuresList = [
    {
      icon: "🌱",
      color: "from-emerald-500 to-green-500",
      title: "Personal Growth",
      description: "Cultivate self-awareness and discover your true potential through guided reflection."
    },
    {
      icon: "💼",
      color: "from-blue-500 to-cyan-500",
      title: "Career Guidance",
      description: "Navigate career transitions and find meaningful work aligned with your values."
    },
    {
      icon: "❤️",
      color: "from-rose-500 to-pink-500",
      title: "Relationship Building",
      description: "Improve communication and create healthier connections with others."
    },
    {
      icon: "🧘",
      color: "from-amber-500 to-yellow-500",
      title: "Stress Management",
      description: "Learn practical techniques to manage stress and build resilience."
    },
    {
      icon: "🎯",
      color: "from-violet-500 to-purple-500",
      title: "Goal Achievement",
      description: "Create actionable plans to achieve your personal and professional goals."
    },
    {
      icon: "💰",
      color: "from-fuchsia-500 to-purple-500",
      title: "Financial Wisdom",
      description: "Develop a healthy relationship with money and create sustainable abundance."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" ref={ref} className="py-24 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-300 to-blue-300 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 text-fuchsia-700 font-medium mb-4">
            SKILLS YOU'LL MASTER
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Our comprehensive masterclass covers all aspects needed for holistic success
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              <div className="h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
              <div className="p-8">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 text-3xl bg-gradient-to-r ${feature.color} text-white transform transition-transform group-hover:scale-110 duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-xl hover:translate-y-1 transition-all duration-300"
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