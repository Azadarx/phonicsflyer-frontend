import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../auth/AuthModal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout, getUserData, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from API when user is authenticated
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (err) {
          // Error handling
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
      navigate('/');
    } catch (err) {
      // Error handling
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

  const handleAuthButtonClick = () => {
    setIsOpen(false); // Close the dropdown
    setShowAuthModal(true); // Show the auth modal
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {currentUser ? (
          // Logged in user menu
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium hover:shadow-lg transition-all focus:outline-none"
            aria-label="User menu"
          >
            {currentUser.displayName ? getInitials(currentUser.displayName) : "U"}
          </motion.button>
        ) : (
          // Login button for non-authenticated users
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthButtonClick}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium hover:shadow-lg transition-all focus:outline-none"
          >
            Sign In
          </motion.button>
        )}

        <AnimatePresence>
          {isOpen && currentUser && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
              className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
            >
              {/* Decorative top bar */}
              <div className="h-1 bg-gradient-to-r from-teal-600 to-blue-600"></div>
              
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-800">{currentUser.displayName || "User"}</p>
                <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                {isAdmin && (
                  <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <div className="py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </div>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default UserMenu;