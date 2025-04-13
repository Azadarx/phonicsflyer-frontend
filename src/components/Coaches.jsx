// src/components/Coaches.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Coaches = () => {
  const coaches = [
    {
      name: "Inspiring Shereen",
      title: "Life Coach",
      description: "Shaping Lives With Holistic Success",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Sikander Tuteja",
      title: "Holistic Success Coach",
      description: "Expert in business growth and personal development",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIDmRb_ZtzR4LA7XUB1lPRxSJG-GlSXbIgRn7dsD4iOfZ3ZrHetNpn69uB4TD2pgS2gWQ&usqp=CAU"
    }
  ];

  return (
    <section id="coaches" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Coaches for Transformation</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Learn from experienced coaches who have helped hundreds transform their lives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {coaches.map((coach, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-48 h-48 overflow-hidden rounded-full mb-6">
                <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{coach.name}</h3>
              <h4 className="text-lg font-medium text-purple-600 mb-3">{coach.title}</h4>
              <p className="text-center text-gray-600 max-w-md">{coach.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coaches;