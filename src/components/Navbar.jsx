// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-20 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-xl md:text-2xl font-bold">
            <Link to="/" className="flex items-center">
              <span className="text-purple-600">Inspiring Shereen</span>
              <span className="text-gray-700 ml-2">| Life Coach</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <a href="#about" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
              <a href="#features" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#coaches" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Coaches</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-purple-700 transition-all duration-300"
                onClick={() => window.location.href = "/register"}
              >
                Enroll Now
              </motion.button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <a href="#about" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="#features" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
            <a href="#coaches" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">Coaches</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white w-full mt-4 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-purple-700 transition-all duration-300"
              onClick={() => window.location.href = "/register"}
            >
              Enroll Now
            </motion.button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;