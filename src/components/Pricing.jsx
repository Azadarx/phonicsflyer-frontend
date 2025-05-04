// src/components/Pricing.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ref, get, set, onValue, off } from 'firebase/database';
import { database } from '../firebase/config';
import { CheckCircle, X, Edit2, Save, Calendar, Clock, MapPin, Layers } from 'lucide-react';

const Pricing = () => {
  const { currentUser, isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [pricingData, setPricingData] = useState({
    title: 'Special Offer',
    subtitle: 'Take advantage of our limited-time discounted pricing on our most popular phonics course',
    cardTitle: 'Phonics Masterclass',
    cardSubtitle: 'Limited seats available!',
    originalPrice: '₹199',
    currentPrice: '₹99',
    startDate: '15th May 2025',
    schedule: 'Weekends, 10:00 AM',
    format: 'Online Live Classes',
    formatDetails: 'Interactive sessions + Practice materials',
    courseIncludes: '12 Lessons + Study Materials',
    buttonText: 'Enroll Now - Only ₹99',
    bannerText: 'Offer ends soon – Reserve your spot today!',
    footerText: 'Transform your English learning journey now',
    discountPercentage: '50',
  });
  
  // Keep track of original data to detect changes
  const [originalData, setOriginalData] = useState({});
  const formRef = useRef(null);
  
  // Check if data has changed to enable/disable save button
  const hasChanges = () => {
    return JSON.stringify(originalData) !== JSON.stringify(pricingData);
  };

  // Fetch pricing data from Firebase RTDB
  useEffect(() => {
    const pricingRef = ref(database, 'pricing');
    
    // Set up real-time listener for pricing data
    const pricingListener = onValue(pricingRef, (snapshot) => {
      setIsLoading(true);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPricingData(data);
        setOriginalData(data);
      } else {
        // Only initialize data if none exists yet
        // Don't try to save automatically as it might fail due to permissions
        setOriginalData(pricingData);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching pricing data:", error);
      setIsLoading(false);
    });
    
    // Cleanup listener on unmount
    return () => off(pricingRef);
  }, []);

  // Save pricing data to Firebase RTDB with better error handling
  const savePricingData = async (data) => {
    if (!currentUser || !isAdmin) {
      const errorMsg = "You must be an admin to save pricing data";
      console.error(errorMsg);
      setSaveError(errorMsg);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Get fresh ID token before request to ensure proper authentication
      const token = await currentUser.getIdToken(true);
      console.log("Using fresh token for pricing update");
      
      const pricingRef = ref(database, 'pricing');
      await set(pricingRef, data);
      
      setOriginalData(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving pricing data:", error);
      const errorMessage = error.message || "Failed to save changes. Please try again.";
      setSaveError(errorMessage);
      
      // Display more helpful error messages based on error code
      if (error.code === "PERMISSION_DENIED") {
        setSaveError("Permission denied. Your account does not have write access to pricing data.");
      }
      
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePricingData(pricingData);
  };

  const cancelEdit = () => {
    setPricingData(originalData);
    setSaveError(null);
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Admin edit form
  const EditForm = () => (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-blue-800">Edit Pricing Details</h2>
        <button 
          type="button" 
          onClick={cancelEdit}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Show error message if there is one */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{saveError}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Main Content */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-l-4 border-blue-500 pl-2">Section Header</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
            <input
              type="text"
              name="title"
              value={pricingData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              name="subtitle"
              value={pricingData.subtitle}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Section 2: Pricing Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-l-4 border-blue-500 pl-2">Pricing Info</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Title</label>
              <input
                type="text"
                name="cardTitle"
                value={pricingData.cardTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Subtitle</label>
              <input
                type="text"
                name="cardSubtitle"
                value={pricingData.cardSubtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="text"
                name="originalPrice"
                value={pricingData.originalPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
              <input
                type="text"
                name="currentPrice"
                value={pricingData.currentPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
            <div className="flex items-center">
              <input
                type="number"
                name="discountPercentage"
                value={pricingData.discountPercentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2">%</span>
            </div>
          </div>
        </div>
        
        {/* Section 3: Course Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-l-4 border-blue-500 pl-2">Course Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="text"
              name="startDate"
              value={pricingData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <input
              type="text"
              name="schedule"
              value={pricingData.schedule}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <input
              type="text"
              name="format"
              value={pricingData.format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format Details</label>
            <input
              type="text"
              name="formatDetails"
              value={pricingData.formatDetails}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Section 4: Additional Content */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 border-l-4 border-blue-500 pl-2">Additional Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Includes</label>
            <input
              type="text"
              name="courseIncludes"
              value={pricingData.courseIncludes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              name="buttonText"
              value={pricingData.buttonText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
            <input
              type="text"
              name="bannerText"
              value={pricingData.bannerText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
            <input
              type="text"
              name="footerText"
              value={pricingData.footerText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={cancelEdit}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!hasChanges() || isSaving}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 transition-colors ${
            !hasChanges() || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle size={16} />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <section id="pricing" className="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
      {/* Admin edit button */}
      {isAdmin && !editMode && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setEditMode(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Edit2 size={20} />
          <span className="hidden sm:inline">Edit Pricing</span>
        </motion.button>
      )}

      {/* Show edit form for admin */}
      {isAdmin && editMode ? (
        <EditForm />
      ) : (
        // Regular pricing display
        <>
          {/* Reduced to just one animated background element */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              animate={{ 
                y: [10, -10, 10],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 20 }}
              className="absolute top-20 left-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-16"
            >
              <div className="inline-block relative mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative z-10">
                  {pricingData.title}
                </h2>
              </div>
              <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600">
                {pricingData.subtitle}
              </p>
            </motion.div>

            <div className="max-w-xl mx-auto">
              <div className="relative">
                {/* Discount tag */}
                <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-16 h-16 md:w-24 md:h-24 bg-yellow-100 rounded-lg shadow-lg flex items-center justify-center transform rotate-12 z-20 border-2 border-yellow-300">
                  <div className="text-center">
                    <div className="text-yellow-500 text-base md:text-lg font-bold">{pricingData.discountPercentage}%</div>
                    <div className="text-gray-700 font-medium text-xs md:text-sm">OFF</div>
                  </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border-t-4 border-blue-600">
                  {/* Wavy pattern at the top */}
                  <div className="h-8 md:h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
                      <path fill="#ffffff" fillOpacity="1" d="M0,96L40,112C80,128,160,160,240,160C320,160,400,128,480,112C560,96,640,96,720,112C800,128,880,160,960,165.3C1040,171,1120,149,1200,149.3C1280,149,1360,171,1400,181.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                    </svg>
                  </div>

                  <div className="p-4 md:p-8">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                      <div>
                        <h3 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                          {pricingData.cardTitle}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm md:text-base">
                          {pricingData.cardSubtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 line-through text-base md:text-lg">{pricingData.originalPrice}</span>
                        <div className="text-2xl md:text-3xl font-extrabold text-blue-600">{pricingData.currentPrice}</div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-6 mb-6 md:mb-8">
                      <div className="flex items-center bg-blue-50 p-3 md:p-4 rounded-xl">
                        <div className="bg-blue-100 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                          <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm text-gray-500">START DATE</div>
                          <div className="text-gray-700 font-bold text-sm md:text-base">{pricingData.startDate}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-cyan-50 p-3 md:p-4 rounded-xl">
                        <div className="bg-cyan-100 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                          <Clock size={20} className="text-cyan-600" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm text-gray-500">CLASS SCHEDULE</div>
                          <div className="text-gray-700 font-bold text-sm md:text-base">{pricingData.schedule}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-teal-50 p-3 md:p-4 rounded-xl">
                        <div className="bg-teal-100 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                          <MapPin size={20} className="text-teal-600" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm text-gray-500">FORMAT</div>
                          <div className="text-gray-700 font-bold text-sm md:text-base">{pricingData.format}</div>
                          <div className="text-xs text-gray-500">{pricingData.formatDetails}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-sky-50 p-3 md:p-4 rounded-xl">
                        <div className="bg-sky-100 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                          <Layers size={20} className="text-sky-600" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm text-gray-500">COURSE INCLUDES</div>
                          <div className="text-gray-700 font-bold text-sm md:text-base">{pricingData.courseIncludes}</div>
                        </div>
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 md:py-4 px-6 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      onClick={() => window.location.href = "/register"}
                    >
                      <span className="mr-2">{pricingData.buttonText}</span>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </motion.button>
                    
                    <div className="text-center mt-4 md:mt-6">
                      <p className="text-gray-600 mb-1">
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs md:text-sm font-medium">
                          {pricingData.bannerText}
                        </span>
                      </p>
                      <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mt-2 text-sm md:text-base">
                        {pricingData.footerText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Pricing;