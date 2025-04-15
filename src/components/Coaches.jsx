// src/components/Coaches.jsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const Coaches = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCoach, setActiveCoach] = useState(null);
  
  const coaches = [
    {
      name: "Inspiring Shereen",
      title: "Life Coach",
      description: "Shaping Lives With Holistic Success",
      image: "/assets/mam.jpg",
      bio: "With over 10 years of experience in transformational coaching, Shereen has helped hundreds of professionals reclaim their purpose and passion.",
      expertise: ["Personal Development", "Life Transformation", "Mindfulness Training"]
    },
    {
      name: "Sikander Tuteja",
      title: "Holistic Success Coach",
      description: "Expert in business growth and personal development",
      image: "/assets/sir.jpg",
      bio: "A seasoned entrepreneur and mindset coach, Sikander specializes in helping professionals align their career goals with their core values.",
      expertise: ["Business Strategy", "Wealth Creation", "Leadership Development"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="coaches" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Colorful background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 transform -skew-y-2"></div>
      <div className="absolute top-20 left-0 w-full h-20 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 transform -skew-y-3 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 text-fuchsia-700 font-medium mb-4">
            MEET YOUR MENTORS
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Coaches for Transformation</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Learn from experienced coaches who have helped hundreds transform their lives
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          {coaches.map((coach, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setActiveCoach(index)}
              onMouseLeave={() => setActiveCoach(null)}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-8 group">
                  {/* Decorative rings */}
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360],
                      scale: activeCoach === index ? 1.1 : 1
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                      scale: { duration: 0.3 }
                    }}
                    className="absolute inset-0 -m-6 rounded-full border-2 border-dashed border-violet-300 z-0"
                  ></motion.div>
                  
                  <motion.div 
                    animate={{ 
                      rotate: [360, 0],
                      scale: activeCoach === index ? 1.15 : 1
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 30, ease: "linear" },
                      scale: { duration: 0.5 }
                    }}
                    className="absolute inset-0 -m-12 rounded-full border-2 border-dashed border-fuchsia-300 z-0"
                  ></motion.div>
                  
                  {/* Coach image */}
                  <div className="relative z-10">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img 
                        src={coach.image} 
                        alt={coach.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Glowing effect on hover */}
                    <motion.div 
                      animate={{ 
                        opacity: activeCoach === index ? 0.6 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 filter blur-xl z-0"
                    ></motion.div>
                  </div>
                </div>
                
                <motion.div 
                  className="text-center"
                  animate={{ 
                    y: activeCoach === index ? -10 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{coach.name}</h3>
                  <p className="text-fuchsia-600 font-medium mb-3">{coach.title}</p>
                  <p className="text-gray-600 italic mb-6">{coach.description}</p>
                  
                  <AnimatePresence>
                    {activeCoach === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-700 mb-4">{coach.bio}</p>
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Expertise</h4>
                          <div className="flex flex-wrap justify-center gap-2">
                            {coach.expertise.map((skill, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-fuchsia-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full hover:from-violet-700 hover:to-fuchsia-700 transition-all transform hover:scale-105">
                          Book a Session
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Coaches;