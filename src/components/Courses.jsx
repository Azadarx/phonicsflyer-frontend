// src/components/Courses.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const Courses = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const coursesList = [
    {
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
      title: "Phonics English",
      description: "Master reading and pronunciation with our comprehensive phonics program designed for all age groups.",
      details: {
        duration: "3 months",
        students: "1,200+",
        features: ["Personalized attention", "Interactive lessons", "Regular assessments"]
      },
      available: true
    }
    // {
    //   icon: "🗣️",
    //   color: "from-teal-500 to-green-500",
    //   title: "Spoken English",
    //   description: "Enhance your communication skills with our conversation-focused English speaking course.",
    //   details: {
    //     duration: "4 months",
    //     students: "950+",
    //     features: ["Confidence building", "Real-world scenarios", "Presentation skills"]
    //   },
    //   available: false
    // },
    // {
    //   icon: "✍️",
    //   color: "from-amber-500 to-yellow-500",
    //   title: "Business English",
    //   description: "Learn professional communication skills essential for workplace success and career advancement.",
    //   details: {
    //     duration: "2 months",
    //     students: "850+",
    //     features: ["Email writing", "Meeting vocabulary", "Negotiations"]
    //   },
    //   available: false
    // },
    // {
    //   icon: "🎯",
    //   color: "from-indigo-500 to-blue-500",
    //   title: "English for Kids",
    //   description: "Fun, interactive lessons designed specifically for young learners to build a strong language foundation.",
    //   details: {
    //     duration: "6 months",
    //     students: "1,500+",
    //     features: ["Engaging activities", "Picture based learning", "Story time"]
    //   },
    //   available: false
    // },
    // {
    //   icon: "🧠",
    //   color: "from-sky-500 to-blue-500",
    //   title: "Advanced Grammar",
    //   description: "Master complex grammar concepts and enhance your writing skills with expert guidance.",
    //   details: {
    //     duration: "3 months",
    //     students: "720+",
    //     features: ["Comprehensive rules", "Practice exercises", "Writing improvement"]
    //   },
    //   available: false
    // },
    // {
    //   icon: "🏆",
    //   color: "from-cyan-500 to-teal-500",
    //   title: "Exam Preparation",
    //   description: "Targeted preparation for IELTS, TOEFL and other English proficiency exams with proven strategies.",
    //   details: {
    //     duration: "2 months",
    //     students: "930+",
    //     features: ["Mock tests", "Score improvement", "Test techniques"]
    //   },
    //   available: false
    // }
  ];

  return (
    <section id="courses" ref={ref} className="py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
      {/* Reduced to just 2 static decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-medium mb-4">
            OUR FEATURED COURSES
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Discover Our Programs</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Expertly crafted courses designed to help you excel in language skills and personal development
          </p>
        </motion.div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */}
        <div className="flex flex-row relative left-[25%] justify-center items-center gap-2 w-[600px]">
          {coursesList.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:translate-y-[-10px] hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
              <div className="p-8">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 text-3xl bg-gradient-to-r ${course.color} text-white transform transition-transform group-hover:scale-110 duration-300`}>
                  {course.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-800">{course.details.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-500">Students</span>
                    <span className="font-medium text-gray-800">{course.details.students}</span>
                  </div>

                  <ul className="space-y-1 mb-6">
                    {course.details.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="https://asta-frontend-quickjoins-projects.vercel.app/courses/phonics" className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
                    View Details
                  </Link>
                </div>
              </div>

              {/* Updated Coming Soon Overlay - More stylish and transparent */}
              {!course.available && (
                <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  {/* Glass effect background with translucent gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-white/20"></div>
                  
                  {/* Diagonal ribbons */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rotate-45 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rotate-45 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg"></div>
                  
                  {/* Central Content */}
                  <div className="relative px-8 py-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-white text-3xl font-bold tracking-wider"
                    >
                      COMING SOON
                    </motion.div>
                    <div className="bg-white h-1 w-full rounded-full my-3 opacity-70"></div>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-white/90 text-sm block"
                    >
                      Stay tuned for updates
                    </motion.span>
                  </div>
                  
                  {/* Notification Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute bottom-8 left-0 right-0 flex justify-center"
                  >
                    <button className="group bg-white/15 hover:bg-white/25 text-white px-6 py-2 rounded-full text-sm backdrop-blur-md border border-white/30 flex items-center space-x-2 transition-all duration-300 shadow-lg">
                      <span>Notify me</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </motion.div>
                </div>
              )}
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
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-xl hover:translate-y-1 transition-all duration-300"
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

export default Courses;