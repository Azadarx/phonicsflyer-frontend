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
    <section id="about" ref={ref} className="py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative elements - adjusted for mobile */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 md:-mr-16 md:-mt-16 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-teal-300 to-blue-300 rounded-full blur-xl md:blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 md:-ml-16 md:-mb-16 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-tr from-blue-300 to-teal-300 rounded-full blur-xl md:blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent text-sm md:text-lg font-medium mb-1 md:mb-2 block">
              ABOUT US
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            Our Story & Mission
          </motion.h2>

          <motion.div variants={itemVariants} className="w-16 md:w-20 lg:w-24 h-1 md:h-2 bg-gradient-to-r from-teal-600 to-blue-600 mx-auto mb-4 md:mb-6 lg:mb-8 rounded-full"></motion.div>

          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 px-2 sm:px-0">
            Dedicated to transforming language learning through effective phonics methods and personalized guidance.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            variants={itemVariants}
            className="relative order-1 lg:order-none"
          >
            <div className="relative z-10 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg md:shadow-xl lg:shadow-2xl border-2 md:border-3 lg:border-4 border-white">
              <img
                src={"https://res.cloudinary.com/dbofquzdr/image/upload/v1745958061/coaches/lz4dsfmupn2htwscixte.jpg"}
                alt="Mrs. Shereen - Phonics Expert"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/dbofquzdr/image/upload/v1745958061/coaches/lz4dsfmupn2htwscixte.jpg";
                  e.target.alt = "Instructor Placeholder";
                }}
              />
            </div>

            {/* Stats - adjusted for mobile */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 md:-bottom-6 md:-right-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md sm:shadow-lg z-20">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">15+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">1,200+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Students Taught</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div variants={containerVariants} initial="hidden" animate={controls} className="order-2 lg:order-none">
            <motion.h3 variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6">
              Meet Your Coach: Mrs. Shereen
            </motion.h3>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6">
              With over 15 years of experience in the education industry, Mrs. Shereen has dedicated her career to transforming how people learn English. Her specialized phonics approach has helped students of all ages master reading, pronunciation, and communication skills.
            </motion.p>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-7 md:mb-8">
              Shereen believes that proper phonics instruction is the foundation for language mastery at any age. Her teaching methodology combines traditional phonics with modern interactive techniques, making learning both effective and enjoyable.
            </motion.p>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Why Choose Our Phonics Program?</h4>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Comprehensive curriculum designed for all age groups",
                  "Personalized attention and individualized learning plans",
                  "Regular assessments and progress tracking",
                  "Interactive and engaging teaching methods"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-teal-100 flex items-center justify-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-7 md:mt-8"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(13, 148, 136, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium shadow-md sm:shadow-lg hover:translate-y-1 transition-all duration-300"
                onClick={() => window.location.href = "/contact"}
              >
                <span className="flex items-center justify-center">
                  Contact Shereen
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Vision and values section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24"
        >
          <motion.h3 variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            Our Vision & Values
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: "🎯",
                color: "from-teal-500 to-emerald-500",
                title: "Our Mission",
                description: "To make English learning accessible to everyone through effective phonics methods that build lasting language skills and confidence."
              },
              {
                icon: "👁️",
                color: "from-blue-500 to-teal-500",
                title: "Our Vision",
                description: "To transform education by personalizing learning experiences that adapt to individual needs and learning styles."
              },
              {
                icon: "❤️",
                color: "from-emerald-500 to-blue-500",
                title: "Our Values",
                description: "Excellence, inclusivity, innovation, and student-centered teaching that empowers learners at every step of their journey."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className={`h-1 sm:h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-r ${item.color} text-white text-2xl sm:text-3xl shadow-sm sm:shadow-md`}>
                    <span>{item.icon}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{item.title}</h4>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 text-center"
        >
          {/* <a href="https://asta-frontend-quickjoins-projects.vercel.app/" rel="noopener noreferrer"> */}
            <motion.button
              onAbort={() => window.location.href = "/register"}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -10px rgba(13, 148, 136, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium shadow-md sm:shadow-lg hover:translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Enroll Now - Only ₹99
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </motion.button>
          {/* </a> */}
        </motion.div>
      </div>
    </section>
  );
};

export default About;