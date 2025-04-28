// src/components/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Patel",
      title: "Phonics English Student",
      text: "The phonics course completely transformed my child's reading ability. Shereen ma'am's teaching methods are engaging and effective!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Vikram Singh",
      title: "Parent",
      text: "My daughter was struggling with reading, but after just 3 months with Shereen ma'am in the phonics program, she's reading fluently and confidently. Worth every penny!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Priya Sharma",
      title: "Adult Learner",
      text: "As someone learning English later in life, the phonics approach helped me pronounce words correctly and boosted my confidence in speaking. Highly recommended for all ages!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Arjun Kapoor",
      title: "Business Professional",
      text: "The professional phonics course improved my pronunciation and communication skills significantly. My clients now understand me better during international calls.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Meera Patel",
      title: "Elementary School Teacher",
      text: "I enrolled in Shereen ma'am's phonics program to enhance my teaching skills. Now I use these techniques in my classroom with amazing results. My students' reading scores have improved by 40%!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Rohan Gupta",
      title: "Parent of Twins",
      text: "Both my kids were at different learning levels, but Shereen ma'am's personalized phonics approach helped them progress at their own pace. Now they both love reading!",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Ananya Reddy",
      title: "College Student",
      text: "I always struggled with English pronunciation. The phonics program gave me the foundation I needed to speak confidently in class presentations and job interviews.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <>
    <Navbar/>
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-blue-50 to-teal-100">
      {/* Background elements with education-themed colors */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
          }}
          className="absolute rounded-full bg-gradient-to-r from-blue-300 to-teal-300 w-96 h-96 top-1/4 left-1/4 filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute rounded-full bg-gradient-to-r from-teal-300 to-green-300 w-96 h-96 bottom-0 right-0 filter blur-3xl opacity-30 transform translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">SUCCESS STORIES</span>
          <div className="inline-block relative mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 relative z-10">Phonics Transformations</h2>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-6">
            See how our phonics program has improved reading and speaking skills for learners of all ages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 hover:-translate-y-3 transition-transform duration-300"
            >
              {/* Card with gradient border effect - education-themed colors */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                  {/* Top colored bar with alphabet pattern */}
                  <div
                    className="h-3"
                    style={{
                      background: `linear-gradient(90deg, rgba(13, 148, 136, 1) ${Math.random() * 20}%, rgba(56, 189, 248, 1) ${Math.random() * 40 + 20}%, rgba(74, 222, 128, 1) ${Math.random() * 30 + 60}%)`
                    }}
                  ></div>

                  <div className="p-8">
                    {/* Book icon instead of quote */}
                    <div className="absolute top-8 right-8 text-teal-200 opacity-30">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,21L9,18H7A2,2 0 0,1 5,16V4C5,2.89 5.9,2 7,2H21A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H19L16,21V18H7A1,1 0 0,0 6,17V19H16V21M7,4V16H17V4H7M14,6V12.5L12.5,11.5L11,12.5V6H14" />
                      </svg>
                    </div>

                    {/* Testimonial content */}
                    <div className="mb-6">
                      <p className="text-gray-600 italic leading-relaxed">{testimonial.text}</p>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-14 w-14 rounded-full object-cover border-2 border-teal-100"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-teal-600 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg"
          >
            Enroll in Phonics Program
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
    </>
  );
};

export default Testimonials;