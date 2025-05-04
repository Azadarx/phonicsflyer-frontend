// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, BookOpen, MessageCircle, Calendar, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        courseInterest: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setFormStatus({ submitting: false, submitted: false, error: error.message });
    }
  };

  return (
    <div id="contact" className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Connect With Us
          </motion.h1>
          <motion.div 
            className="h-1 w-20 bg-yellow-300 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
          <motion.p 
            className="text-gray-800/90 mt-4 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Transform your English speaking skills with our expert phonics coaching. Get in touch today!
          </motion.p>
        </motion.div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-400 to-blue-600 rounded-bl-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-tr-full opacity-20"></div>
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="mb-6">
              <motion.p 
                className="text-sm text-teal-600 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Empowering English Fluency Since 2018
              </motion.p>
              <motion.p
                className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Ready to begin your phonics journey? We're here to help!
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="text-teal-600 mr-2" size={20} />
                  About Our Phonics Program
                </h3>
                <p className="text-gray-700 mb-4">Our comprehensive phonics curriculum is designed for learners of all ages, from young students to adults seeking to improve their English pronunciation and reading skills.</p>
                <p className="text-gray-700 mb-2"><span className="font-medium">Instructor:</span> Mrs. Shereen</p>
                <p className="text-gray-700 mb-2"><span className="font-medium">Certification:</span> Advanced Phonics Teaching Specialist</p>
                <p className="text-gray-700"><span className="font-medium">Experience:</span> 15+ years teaching phonics to diverse age groups</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <MessageCircle className="text-teal-600 mr-2" size={20} />
                    Contact Information
                  </h3>
                  <p className="text-gray-700 mb-4">Have questions about our phonics programs? We'd love to help you discover the right learning path for your needs.</p>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-700 flex items-center">
                    <Mail className="text-teal-600 mr-2" size={18} />
                    <span className="font-medium">Email:</span> 
                    <a href="mailto:inspiringshereen@gmail.com" className="text-teal-600 ml-1 hover:text-teal-800 transition-colors">
                      inspiringshereen@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Program details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-r from-teal-100 to-teal-50 p-5 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <Calendar className="text-teal-600 mr-2" size={18} />
                  Program Schedule
                </h3>
                <p className="text-gray-700 mb-2">Weekday Classes: 6-8 PM</p>
                <p className="text-gray-700 mb-2">Weekend Workshops: 10 AM-12 PM</p>
                <p className="text-gray-700">Flexible timings for professionals</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-r from-blue-100 to-blue-50 p-5 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <BookOpen className="text-teal-600 mr-2" size={18} />
                  Courses Offered
                </h3>
                <p className="text-gray-700 mb-2">Beginner Phonics Fundamentals</p>
                <p className="text-gray-700 mb-2">Advanced Pronunciation Masters</p>
                <p className="text-gray-700">Professional English Speaking</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-r from-indigo-100 to-indigo-50 p-5 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <MessageCircle className="text-teal-600 mr-2" size={18} />
                  Learning Methods
                </h3>
                <p className="text-gray-700 mb-2">Interactive Online Sessions</p>
                <p className="text-gray-700 mb-2">In-person Workshops</p>
                <p className="text-gray-700">Personalized Coaching Available</p>
              </motion.div>
            </motion.div>
            
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Inquire About Our Programs</h3>
              
              {formStatus.submitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                  <h4 className="text-xl font-bold text-green-700 mb-2">Thank You!</h4>
                  <p className="text-gray-700">Your message has been sent successfully. We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" 
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" 
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition" 
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-gray-700 mb-2 font-medium">Course Interest</label>
                    <select 
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Select a program</option>
                      <option value="beginner">Beginner Phonics</option>
                      <option value="advanced">Advanced Pronunciation</option>
                      <option value="professional">Professional Speaking</option>
                      <option value="custom">Custom Learning Plan</option>
                    </select>
                  </div> */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium">Your Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition h-32" 
                      placeholder="Tell us about your learning goals or any specific questions"
                      required
                    ></textarea>
                  </div>
                  
                  {formStatus.error && (
                    <div className="md:col-span-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <p>Error: {formStatus.error}</p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      type="submit"
                      disabled={formStatus.submitting}
                    >
                      {formStatus.submitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Submit Inquiry <Send className="ml-2" size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;