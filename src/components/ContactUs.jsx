// src/pages/ContactUs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
          <motion.div 
            className="h-1 w-20 bg-yellow-300 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
          <motion.p 
            className="text-white/90 mt-4 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            We'd love to hear from you! Reach out using the information below.
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-600 rounded-bl-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400 to-indigo-600 rounded-tr-full opacity-20"></div>
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="mb-6">
              <motion.p 
                className="text-sm text-purple-600 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Last updated on 15-04-2025 14:30:34
              </motion.p>
              <motion.p
                className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                You may contact us using the information below:
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="text-purple-600 mr-2" size={20} />
                  Merchant Details
                </h3>
                <p className="text-gray-700 mb-2"><span className="font-medium">Legal entity name:</span> SHEREEN BEGUM</p>
                <p className="text-gray-700 mb-2"><span className="font-medium">Registered Address:</span></p>
                <p className="text-gray-700 pl-4">16-9-610/201, Kala Classic Apartment,</p>
                <p className="text-gray-700 pl-4">Agriculture Office Road, Malakpet Colony,</p>
                <p className="text-gray-700 pl-4">Telangana, PIN: 500036</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="text-purple-600 mr-2" size={20} />
                    Operational Address
                  </h3>
                  <p className="text-gray-700 pl-4">16-9-610/201, Kala Classic Apartment,</p>
                  <p className="text-gray-700 pl-4">Agriculture Office Road, Malakpet Colony,</p>
                  <p className="text-gray-700 pl-4">Telangana, PIN: 500036</p>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-700 mb-3 flex items-center">
                    <Phone className="text-purple-600 mr-2" size={18} />
                    <span className="font-medium">Phone:</span> 9494100110
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <Mail className="text-purple-600 mr-2" size={18} />
                    <span className="font-medium">Email:</span> 
                    <a href="mailto:phonicswithshereen@gmail.com" className="text-purple-600 ml-1 hover:text-purple-800 transition-colors">
                      phonicswithshereen@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Send us a message</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" 
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" 
                    placeholder="Enter subject"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition h-32" 
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    type="submit"
                  >
                    Send Message
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;