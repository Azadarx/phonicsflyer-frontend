// src/pages/TermsAndConditions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsAndConditions = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const termsList = [
    "To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.",
    "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
    "Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.",
    "The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.",
    "You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.",
    "You agree to pay us the charges associated with availing the Services.",
    "You agree not to use the website and/ or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.",
    "You agree and acknowledge that website and the Services may contain links to other third party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third party websites.",
    "You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with the us for the Services.",
    "You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service. The timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable). In case you do not raise a refund claim within the stipulated time, than this would make you ineligible for a refund.",
    "Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.",
    "These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.",
    "All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Malakpet Colony, Telangana.",
    "All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website."
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Shield className="text-white h-6 w-6" />
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl font-bold text-white mb-3"
            >
              Terms & Conditions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white/80 text-lg"
            >
              Last updated on 15-04-2025 14:32:48
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-purple-200 to-transparent rounded-full opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-blue-200 to-transparent rounded-full opacity-20 -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 0.8 }}
                className="prose max-w-none"
              >
                <p className="text-gray-700 leading-relaxed mb-8">
                  These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding
                  agreement by and between SHEREEN BEGUM, ("Website Owner" or "we" or "us" or "our") and you
                  ("you" or "your") and relate to your use of our website, goods (as applicable) or services (as applicable)
                  (collectively, "Services").
                </p>

                <p className="text-gray-700 leading-relaxed mb-8">
                  By using our website and availing the Services, you agree that you have read and accepted these Terms
                  (including the Privacy Policy). We reserve the right to modify these Terms at any time and without
                  assigning any reason. It is your responsibility to periodically review these Terms to stay informed of
                  updates.
                </p>

                <p className="text-gray-700 font-medium mb-6">
                  The use of this website or availing of our Services is subject to the following terms of use:
                </p>

                <div className="space-y-6">
                  {termsList.map((term, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="flex items-start space-x-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl"
                    >
                      <CheckCircle className="text-purple-600 h-6 w-6 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{term}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Accept terms button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-10 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  I Accept the Terms & Conditions
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default TermsAndConditions;