// src/components/Instructors.jsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
// import shereenImg from '../assets/shereen.jpg';
// import assistantImg from '../assets/assistant.jpg';

const Instructors = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeInstructor, setActiveInstructor] = useState(null);
  
  const instructors = [
    {
      name: "Shereen Begum",
      title: "Phonics Expert & Lead Instructor",
      description: "Transforming language learning through innovative phonics",
      image: {},
      bio: "With over 15 years of experience in education, Shereen has helped thousands of students master English language through her specialized phonics methodology.",
      expertise: ["Phonics Teaching", "English Pronunciation", "Reading Skills"]
    },
    {
      name: "Aisha Khan",
      title: "English Language Specialist",
      description: "Helping adults and children master communication skills",
      image: {},
      bio: "A dedicated educator with 8+ years of experience in teaching English to diverse age groups using effective, interactive learning techniques.",
      expertise: ["Spoken English", "Grammar Mastery", "Conversation Practice"]
    }
  ];

  return (
    <section id="instructors" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Colorful background elements - using blue/cyan tones for education theme */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 transform -skew-y-2"></div>
      <div className="absolute top-20 left-0 w-full h-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transform -skew-y-3 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-medium mb-4">
            EXPERT EDUCATORS
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Your Instructors</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Learn from experienced teachers who have helped thousands master English phonics and communication skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {instructors.map((instructor, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveInstructor(index)}
              onMouseLeave={() => setActiveInstructor(null)}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-8 group">
                  {/* Single decorative ring with animation */}
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360],
                      scale: activeInstructor === index ? 1.1 : 1
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                      scale: { duration: 0.3 }
                    }}
                    className="absolute inset-0 -m-6 rounded-full border-2 border-dashed border-blue-300 z-0"
                  ></motion.div>
                  
                  {/* Instructor image */}
                  <div className="relative z-10">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img 
                        src={instructor.image} 
                        alt={instructor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{instructor.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{instructor.title}</p>
                  <p className="text-gray-600 italic mb-6">{instructor.description}</p>
                  
                  <AnimatePresence>
                    {activeInstructor === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-700 mb-4">{instructor.bio}</p>
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Expertise</h4>
                          <div className="flex flex-wrap justify-center gap-2">
                            {instructor.expertise.map((skill, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105">
                          Book a Demo Class
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;