// src/pages/RefundAndCancellation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Clock, CheckSquare } from 'lucide-react';

const RefundAndCancellation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const policyPoints = [
    {
      icon: <Clock className="h-8 w-8 text-indigo-500" />,
      title: "Immediate Cancellation",
      content: "Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-pink-500" />,
      title: "Perishable Items",
      content: "Mrs. Shereen does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good."
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-purple-500" />,
      title: "Damaged or Defective Items",
      content: "In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within Only same day days of receipt of the products."
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
      title: "Product Expectations",
      content: "In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within Only same day days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4"
          >
            <RotateCcw className="text-white h-6 w-6" />
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl font-bold text-white mb-3"
          >
            Cancellation & Refund Policy
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/80 text-lg"
          >
            Last updated on 15-04-2025 14:34:10
          </motion.p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-purple-100 via-indigo-100 to-transparent rounded-full opacity-30 -mr-40 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-t from-blue-100 via-indigo-100 to-transparent rounded-full opacity-30 -ml-40 -mb-20"></div>
          
          <div className="relative z-10">
            <motion.p
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 mb-10 leading-relaxed"
            >
              Mrs. Shereen believes in helping its customers as far as possible, and has therefore a liberal
              cancellation policy. Under this policy:
            </motion.p>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            >
              {policyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{point.title}</h3>
                      <p className="text-gray-600">{point.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-100"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-2">Manufacturer Warranty</h3>
              <p className="text-gray-600">
                In case of complaints regarding products that come with a warranty from manufacturers, please refer
                the issue to them. In case of any Refunds approved by the Mrs. Shereen, it'll take 3-5 Days days
                for the refund to be processed to the end customer.
              </p>
            </motion.div>

            {/* Contact support button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Contact Support
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundAndCancellation;