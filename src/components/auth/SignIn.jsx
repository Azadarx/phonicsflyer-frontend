// src/components/auth/SignIn.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const SignIn = ({ onClose, switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      // Error is already set in the context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-violet-700">Sign In</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Your email"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Your password"
            required
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </div>
          ) : "Sign In"}
        </motion.button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button 
            onClick={switchToSignUp} 
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// src/components/auth/SignUp.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const SignUp = ({ onClose, switchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error, setError } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.fullName, formData.phone);
      onClose();
    } catch (err) {
      console.error("Signup error:", err);
      // Error is already set in the context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-violet-700">Create Account</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Your full name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Your email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Your phone number"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Create a password"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : "Sign Up"}
        </motion.button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button 
            onClick={switchToSignIn} 
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// src/components/auth/UserMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const { currentUser, logout, getUserData } = useAuth();
  
  useEffect(() => {
    // Fetch user data from Firestore when user is authenticated
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser, getUserData]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:shadow-lg transition-all focus:outline-none"
        aria-label="User menu"
      >
        {currentUser?.displayName ? getInitials(currentUser.displayName) : "U"}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-800">{currentUser?.displayName || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
            </div>
            
            <div className="py-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </div>
              </Link>
              
              <Link
                to="/my-registrations"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Registrations
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// src/components/auth/AuthModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthModal = ({ isOpen, onClose }) => {
  const [showSignIn, setShowSignIn] = useState(true);
  
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2 } }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <motion.div
          variants={contentVariants}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {showSignIn ? (
            <SignIn onClose={onClose} switchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUp onClose={onClose} switchToSignIn={() => setShowSignIn(true)} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export { SignIn, SignUp, UserMenu, AuthModal };