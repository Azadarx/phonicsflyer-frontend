// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Check if we're at the top for "home" active state
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      
      // Active section detection
      const sections = ['about', 'features', 'coaches', 'pricing'];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg py-3' 
          : 'bg-white/80 backdrop-blur-lg py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 hover:scale-105 transition-transform">
            <Link to="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
                Inspiring Shereen
              </span>
              <span className="hidden md:block text-gray-700 ml-2 italic">
                | Life Coach
              </span>
            </Link>
          </div>
          
          {/* Updated desktop navigation to apply from min-width 400px */}
          <div className="hidden sm:flex items-center">
            <div className="flex items-center space-x-6">
              {['home', 'about', 'features', 'coaches', 'pricing'].map((item) => (
                <a
                  key={item}
                  href={item === 'home' ? '/' : `#${item}`}
                  className={`relative px-2 py-2 text-sm font-medium transition-colors duration-300 hover:scale-110 ${
                    activeSection === item
                      ? 'text-violet-600'
                      : 'text-gray-700 hover:text-violet-500'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  {activeSection === item && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>
            
            <div className="ml-8 hover:scale-105 transition-transform">
              <Link 
                to="/register" 
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Enroll Now
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button - now only shows below 400px */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-violet-600 focus:outline-none"
              aria-label="Toggle menu"
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

      {/* Mobile menu - now only shows below 400px */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden bg-white shadow-xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {['home', 'about', 'features', 'coaches', 'pricing'].map((item) => (
                <div key={item}>
                  <a 
                    href={item === 'home' ? '/' : `#${item}`}
                    className={`block px-4 py-2 rounded-lg text-base font-medium ${
                      activeSection === item
                        ? 'bg-violet-50 text-violet-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </div>
              ))}
              
              <div className="pt-2 px-4">
                <Link 
                  to="/register" 
                  className="block w-full bg-violet-600 hover:bg-violet-700 text-white py-2 text-center rounded-lg font-medium transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;