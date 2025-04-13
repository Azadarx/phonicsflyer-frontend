// src/components/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const featuresList = [
    {
      icon: "🌱",
      title: "Personal Growth",
      description: "Cultivate self-awareness and discover your true potential through guided reflection."
    },
    {
      icon: "💼",
      title: "Career Guidance",
      description: "Navigate career transitions and find meaningful work aligned with your values."
    },
    {
      icon: "❤️",
      title: "Relationship Building",
      description: "Improve communication and create healthier connections with others."
    },
    {
      icon: "🧘",
      title: "Stress Management",
      description: "Learn practical techniques to manage stress and build resilience."
    },
    {
      icon: "🎯",
      title: "Goal Achievement",
      description: "Create actionable plans to achieve your personal and professional goals."
    },
    {
      icon: "💰",
      title: "Financial Wisdom",
      description: "Develop a healthy relationship with money and create sustainable abundance."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Our comprehensive masterclass covers all aspects needed for holistic success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
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

export default Features;