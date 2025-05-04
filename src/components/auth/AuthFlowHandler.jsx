import React from 'react';
import { motion } from 'framer-motion';
import RegisterForm from '../RegisterForm';

const AuthFlowHandler = () => {
  // Enhanced smooth transition animations with updated styling
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.4,
        ease: "easeIn" 
      }
    }
  };

  return (
    <motion.div
      key="register-form"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className="w-full relative z-10"
    >
      {/* Decorative elements like in Hero component */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-teal-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-teal-300 to-emerald-300 rounded-full blur-3xl opacity-20"></div>
      
      <RegisterForm />
    </motion.div>
  );
};

export default AuthFlowHandler;