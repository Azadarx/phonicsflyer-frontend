// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserMenu from './auth/UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  // Set active section based on the current path or scroll position
  useEffect(() => {
    // First check if we're on a specific route
    if (location.pathname === '/') {
      setActiveSection('home');
    } else if (location.pathname === '/contact') {
      setActiveSection('contact');
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Only do scroll-based section detection on the home page
      if (location.pathname === '/') {
        // Check if we're at the top for "home" active state
        if (window.scrollY < 100) {
          setActiveSection('home');
          return;
        }

        // Active section detection
        const sections = ['about', 'instructors', 'contact'];
        sections.forEach(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section);
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle smooth scrolling for hash links
  const handleNavClick = (section) => {
    setIsOpen(false);

    if (location.pathname !== '/') {
      // If we're not on the home page, navigate to home and then scroll
      // This is handled elsewhere, so we just return
      return;
    }

    // If we're on the home page, scroll to the section
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Generate the correct href based on whether the link is to a section on the homepage
  // or to a separate page
  const getHref = (item) => {
    if (item === 'home') return '/';

    // If we're already on the homepage, use hash links
    if (location.pathname === '/') {
      return `#${item}`;
    }

    // Otherwise, return full page links
    return `/${item}`;
  };

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ${scrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-white/80 backdrop-blur-lg py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 hover:scale-105 transition-transform">
              <Link to="/" className="flex items-center">
                <span className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                  ASTA PHONICS FUN
                </span>
                <span className="hidden md:block text-gray-700 ml-2 italic">
                  | AstaEducationAcademy
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center space-x-6">
                {['home', 'about', 'instructors', 'contact'].map((item) => (
                  <Link
                    key={item}
                    to={getHref(item)}
                    className={`relative px-2 py-2 text-sm font-medium transition-colors duration-300 hover:scale-110 ${activeSection === item
                      ? 'text-teal-600'
                      : 'text-gray-700 hover:text-teal-500'
                      }`}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    {activeSection === item && (
                      <motion.span
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="ml-8 flex items-center space-x-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-lg hover:translate-y-1 transition-all duration-300"
                >
                  Enroll Now
                </Link>

                {currentUser ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-gray-700 hover:text-teal-600 font-medium transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile navigation area with Home button and hamburger */}
            <div className="sm:hidden flex items-center space-x-4">

              {/* Mobile hamburger button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* User Menu for mobile - placed at the end */}
              <div className="ml-2">
                {currentUser ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-gray-700 hover:text-teal-600"
                    aria-label="Sign In"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden"
              id="mobile-menu"
            >
              <div className="px-6 pt-2 pb-3 space-y-2 bg-white shadow-lg">
                {['home', 'about', 'instructors', 'contact'].map((item) => (
                  <Link
                    key={item}
                    to={getHref(item)}
                    className={`block px-3 py-2 text-base font-medium rounded-md ${activeSection === item
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                      }`}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                ))}
                <Link
                  to="/register"
                  className="block w-full text-center mt-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-lg hover:translate-y-1 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Enroll Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;