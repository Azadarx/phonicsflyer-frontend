// Refactored Instructors.jsx with improved error handling and user feedback
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref as dbRef, onValue, set, push, update, get } from 'firebase/database';
import { Link } from 'react-router-dom';

// Error types for better error handling
const ERROR_TYPES = {
  PERMISSION: 'permission_denied',
  NETWORK: 'network_error',
  DATA: 'data_error',
  GENERAL: 'general_error'
};

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

const Instructors = () => {
  const { currentUser, isAdmin } = useAuth();
  const sectionRef = useRef(null);
  const [activeInstructor, setActiveInstructor] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingStatusChanges, setPendingStatusChanges] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Cloudinary config
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Improved logging that only shows detailed errors in development
  const logError = (message, error, type = ERROR_TYPES.GENERAL) => {
    if (isDevelopment) {
      console.error(`[${type}] ${message}:`, error);
    } else {
      // In production, log minimal info without details
      console.error(`Error occurred: ${type}`);
    }

    setError(message);
    setErrorType(type);
  };

  // Fetch instructors data from Firebase RTDB with better error handling and retries
  useEffect(() => {
    const fetchInstructors = () => {
      if (isDevelopment) console.log(`Fetching instructors from Firebase (attempt ${retryCount + 1})...`);

      setLoading(true);
      const db = getDatabase();
      const instructorsRef = dbRef(db, 'instructors');

      // Clear previous error state when retrying
      setError(null);
      setErrorType(null);

      // First try using onValue for real-time updates
      let unsubscribe = null;
      try {
        unsubscribe = onValue(instructorsRef, (snapshot) => {
          if (isDevelopment) console.log("Received instructors snapshot:", snapshot.exists());

          try {
            if (snapshot.exists()) {
              const instructorsData = snapshot.val();
              const instructorsArray = Object.keys(instructorsData).map(key => ({
                id: key,
                ...instructorsData[key],
                // Ensure status exists, default to active if not specified
                status: instructorsData[key].status !== undefined ? instructorsData[key].status : 'active'
              }));

              if (isDevelopment) console.log("Processed instructors:", instructorsArray.length);
              setInstructors(instructorsArray);
              // Clear pending changes when fresh data is loaded
              setPendingStatusChanges({});
              setHasChanges(false);
              // Reset retry counter on success
              setRetryCount(0);
            } else {
              if (isDevelopment) console.log("No instructors found, setting default");
              loadDefaultInstructor();
            }
          } catch (error) {
            logError("Error processing instructors data", error, ERROR_TYPES.DATA);
            loadDefaultInstructor();
          } finally {
            setLoading(false);
          }
        }, (error) => {
          // Handle specific Firebase error codes
          if (error.code === 'PERMISSION_DENIED') {
            logError("You don't have permission to access instructor data", error, ERROR_TYPES.PERMISSION);
            // If we get a permission error, try a one-time get operation instead
            fetchInstructorsWithGet();
          } else if (error.code === 'NETWORK_ERROR' || error.code === 'DISCONNECTED') {
            logError("Network connection issue", error, ERROR_TYPES.NETWORK);
            handleRetry();
          } else {
            logError("Error loading instructors", error, ERROR_TYPES.GENERAL);
            loadDefaultInstructor();
          }
          setLoading(false);
        });
      } catch (setupError) {
        logError("Error setting up data listener", setupError, ERROR_TYPES.GENERAL);
        fetchInstructorsWithGet();
      }

      // Cleanup function
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };

    // Handle retry logic for network errors
    const handleRetry = () => {
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
        if (isDevelopment) console.log(`Retrying in ${delay}ms...`);

        const timeoutId = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, delay);

        return () => clearTimeout(timeoutId);
      } else {
        logError("Failed to connect after multiple attempts",
          { message: "Max retry count exceeded" },
          ERROR_TYPES.NETWORK);
        loadDefaultInstructor();
      }
    };

    fetchInstructors();
  }, [currentUser, isAdmin, retryCount]);

  // Fallback function to fetch instructors with get() instead of onValue
  const fetchInstructorsWithGet = async () => {
    if (isDevelopment) console.log("Falling back to one-time get for instructors");
    const db = getDatabase();
    const instructorsRef = dbRef(db, 'instructors');

    try {
      const snapshot = await get(instructorsRef);
      if (snapshot.exists()) {
        const instructorsData = snapshot.val();
        const instructorsArray = Object.keys(instructorsData).map(key => ({
          id: key,
          ...instructorsData[key],
          status: instructorsData[key].status !== undefined ? instructorsData[key].status : 'active'
        }));

        if (isDevelopment) console.log("Processed instructors from get():", instructorsArray.length);
        setInstructors(instructorsArray);
        // Reset retry counter on success
        setRetryCount(0);
        // Clear error state on success
        setError(null);
        setErrorType(null);
      } else {
        if (isDevelopment) console.log("No instructors found in get() method");
        loadDefaultInstructor();
      }
    } catch (getError) {
      // Check for specific error codes in the fallback method too
      if (getError.code === 'PERMISSION_DENIED') {
        logError("You don't have permission to access this data", getError, ERROR_TYPES.PERMISSION);
      } else {
        logError("Could not load instructors", getError, ERROR_TYPES.GENERAL);
      }
      loadDefaultInstructor();
    } finally {
      setLoading(false);
    }
  };

  // Function to load the default instructor when no data is available
  const loadDefaultInstructor = () => {
    const defaultInstructor = {
      name: "Shereen Begum",
      title: "Phonics Expert & Lead Instructor",
      description: "Transforming language learning through innovative phonics",
      image: "https://life-coaching-frontend.vercel.app/assets/mam-Cfx9nYsC.jpg",
      bio: "With over 15 years of experience in education, Shereen has helped thousands of students master English language through her specialized phonics methodology.",
      expertise: ["Phonics Teaching", "English Pronunciation", "Reading Skills"],
      status: 'active'
    };

    // Add the default instructor to the database if admin
    if (currentUser && isAdmin) {
      createDefaultInstructor(defaultInstructor);
      setInstructors([{ ...defaultInstructor, id: 'pending' }]); // Show while creating
    } else {
      // Non-admin users should still see a placeholder
      setInstructors([{ ...defaultInstructor, id: 'default' }]);
    }
  };

  // Create default instructor in Firebase
  const createDefaultInstructor = async (instructorData) => {
    try {
      const db = getDatabase();
      const instructorsRef = dbRef(db, 'instructors');
      const newInstructorRef = push(instructorsRef);
      await set(newInstructorRef, instructorData);
      if (isDevelopment) console.log("Default instructor created successfully");
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        logError("You don't have permission to create an instructor", error, ERROR_TYPES.PERMISSION);
      } else {
        logError("Error creating default instructor", error, ERROR_TYPES.GENERAL);
      }
    }
  };

  // Toggle edit mode
  const toggleEditMode = (force = null) => {
    const newState = force !== null ? force : !editMode;
    setEditMode(newState);
    if (!newState) {
      setEditingInstructor(null);
      setImageFile(null);
      setImagePreview(null);
      // Clear pending changes when exiting edit mode
      setPendingStatusChanges({});
      setHasChanges(false);
    }
  };

  // Toggle instructor status
  const toggleInstructorStatus = (instructorId) => {
    // Find the instructor to toggle
    const instructorToToggle = instructors.find(instructor => instructor.id === instructorId);

    if (!instructorToToggle) return;

    // Get current status (from pending changes if exists, otherwise from instructor)
    const currentStatus = pendingStatusChanges[instructorId] !== undefined
      ? pendingStatusChanges[instructorId]
      : instructorToToggle.status;

    // Toggle between 'active' and 'inactive'
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Update pending changes
    setPendingStatusChanges(prev => ({
      ...prev,
      [instructorId]: newStatus
    }));

    // Set hasChanges flag to true since we now have a pending change
    setHasChanges(true);
  };

  // Save all status changes
  const saveStatusChanges = async () => {
    if (Object.keys(pendingStatusChanges).length === 0) {
      return; // No changes to save
    }

    try {
      setSaveStatus("Saving status changes...");
      const db = getDatabase();
      const updates = {};

      // Prepare batch updates for all changed instructors
      Object.entries(pendingStatusChanges).forEach(([instructorId, newStatus]) => {
        if (instructorId !== 'default' && instructorId !== 'pending') {
          updates[`instructors/${instructorId}/status`] = newStatus;
        }
      });

      // Execute batch update
      if (Object.keys(updates).length > 0) {
        await update(dbRef(db), updates);
        if (isDevelopment) console.log("Status changes saved successfully:", updates);

        // Update local state to reflect changes immediately
        setInstructors(prevInstructors =>
          prevInstructors.map(instructor => {
            if (pendingStatusChanges[instructor.id] !== undefined) {
              return { ...instructor, status: pendingStatusChanges[instructor.id] };
            }
            return instructor;
          })
        );

        // Clear pending changes
        setPendingStatusChanges({});
        setHasChanges(false);

        setSaveStatus("Status changes saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        logError("You don't have permission to update instructor status", error, ERROR_TYPES.PERMISSION);
        setSaveStatus("Error: You don't have permission to update instructor status");
      } else {
        logError("Error saving status changes", error, ERROR_TYPES.GENERAL);
        setSaveStatus("Error saving status changes: " + (isDevelopment ? error.message : "Please try again later"));
      }
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    try {
      setIsUploading(true);
      setSaveStatus("Uploading image...");

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (isDevelopment) console.log("Cloudinary upload successful:", data);
      return data.secure_url;
    } catch (error) {
      logError("Error uploading to Cloudinary", error, ERROR_TYPES.NETWORK);
      throw error; // Re-throw to be handled by the calling function
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle editing an instructor
  const handleEditInstructor = (instructor) => {
    setEditMode(true);
    setEditingInstructor({ ...instructor });
    setImagePreview(instructor.image);
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setEditingInstructor(prev => ({ ...prev, [field]: value }));
  };

  // Handle expertise change (comma-separated)
  const handleExpertiseChange = (value) => {
    const expertiseArray = value.split(',').map(item => item.trim()).filter(item => item);
    setEditingInstructor(prev => ({ ...prev, expertise: expertiseArray }));
  };

  // Save instructor to Firebase
  const saveInstructor = async () => {
    try {
      setSaveStatus("Saving...");
      const db = getDatabase();

      if (!editingInstructor) {
        setSaveStatus("Error: No instructor data to save");
        return;
      }

      // Validate required fields first to avoid unnecessary network requests
      if (!editingInstructor.name || !editingInstructor.title) {
        setSaveStatus("Error: Name and title are required");
        return;
      }

      // If we have a new image file, upload it to Cloudinary
      if (imageFile) {
        try {
          const imageUrl = await uploadImageToCloudinary(imageFile);
          editingInstructor.image = imageUrl;
        } catch (error) {
          setSaveStatus(`Error uploading image: ${isDevelopment ? error.message : "Please check your connection"}`);
          return;
        }
      }

      // Validate image after potential upload
      if (!editingInstructor.image) {
        setSaveStatus("Error: Instructor must have an image");
        return;
      }

      // Make sure status field exists
      if (!editingInstructor.status) {
        editingInstructor.status = 'active';
      }

      // Update or create the instructor in RTDB
      if (editingInstructor.id && editingInstructor.id !== 'default' && editingInstructor.id !== 'pending') {
        // Update existing instructor
        await set(dbRef(db, `instructors/${editingInstructor.id}`), {
          name: editingInstructor.name || "",
          title: editingInstructor.title || "",
          description: editingInstructor.description || "",
          image: editingInstructor.image || "",
          bio: editingInstructor.bio || "",
          expertise: editingInstructor.expertise || [],
          status: editingInstructor.status
        });
        if (isDevelopment) console.log("Updated instructor:", editingInstructor.id);
      } else {
        // Create new instructor
        const newInstructorRef = push(dbRef(db, 'instructors'));
        await set(newInstructorRef, {
          name: editingInstructor.name || "",
          title: editingInstructor.title || "",
          description: editingInstructor.description || "",
          image: editingInstructor.image || "",
          bio: editingInstructor.bio || "",
          expertise: editingInstructor.expertise || [],
          status: 'active' // Default to active for new instructors
        });
        if (isDevelopment) console.log("Created new instructor with ID:", newInstructorRef.key);
      }

      // Reset states
      setImageFile(null);
      setImagePreview(null);
      setEditingInstructor(null);
      setSaveStatus("Saved successfully!");

      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        logError("You don't have permission to save instructor data", error, ERROR_TYPES.PERMISSION);
        setSaveStatus("Error: You don't have permission to save instructor data");
      } else {
        logError("Error saving instructor", error, ERROR_TYPES.GENERAL);
        setSaveStatus(`Error: ${isDevelopment ? error.message : "Could not save. Please try again."}`);
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingInstructor(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // Add new instructor
  const addNewInstructor = () => {
    setEditingInstructor({
      name: "",
      title: "",
      description: "",
      image: "",
      bio: "",
      expertise: [],
      status: 'active'
    });
  };

  // Delete instructor
  const deleteInstructor = async (instructorId) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      try {
        const db = getDatabase();
        await set(dbRef(db, `instructors/${instructorId}`), null);
        setSaveStatus("Instructor deleted successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        if (error.code === 'PERMISSION_DENIED') {
          logError("You don't have permission to delete this instructor", error, ERROR_TYPES.PERMISSION);
          setSaveStatus("Error: You don't have permission to delete this instructor");
        } else {
          logError("Error deleting instructor", error, ERROR_TYPES.GENERAL);
          setSaveStatus(`Error: ${isDevelopment ? error.message : "Could not delete. Please try again."}`);
        }
      }
    }
  };

  // Retry data fetch manually
  const handleManualRetry = () => {
    setRetryCount(0); // Reset counter to trigger a fresh fetch
  };

  // ... [previous code remains unchanged]

  // Render loading state
  if (loading) {
    return (
      <section id="instructors" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600">Loading instructors...</p>
          {error && (
            <div className="text-red-500 mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium">{error}</p>
              {errorType === ERROR_TYPES.NETWORK && (
                <button
                  onClick={handleManualRetry}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Render permission denied state
  if (errorType === ERROR_TYPES.PERMISSION) {
    return (
      <section id="instructors" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800">Access Denied</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              You don't have permission to view or modify instructor information.
              {currentUser ? " Please contact an administrator if you need access." : " Please sign in with an authorized account."}
            </p>

            {!currentUser && (
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}

            {/* Show fallback instructors for all users */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Expert Team</h4>
              <div className="flex flex-wrap justify-center">
                {instructors.map((instructor, index) => (
                  <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-10 flex justify-center">
                    <div className="max-w-xs w-full bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="w-full h-64 overflow-hidden">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{instructor.name}</h3>
                        <p className="text-blue-600 font-medium mb-3">{instructor.title}</p>
                        <p className="text-gray-600 text-sm mb-6 italic">{instructor.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render network error state with retry button
  if (errorType === ERROR_TYPES.NETWORK && retryCount >= maxRetries) {
    return (
      <section id="instructors" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800">Connection Error</h3>
            </div>
            <p className="text-red-700 mb-4">
              We're having trouble connecting to our servers. This could be due to your internet connection or our servers might be temporarily unavailable.
            </p>

            <button
              onClick={handleManualRetry}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Try Again
            </button>

            {/* Show fallback instructors anyway */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Expert Team</h4>
              <div className="flex flex-wrap justify-center">
                {instructors.map((instructor, index) => (
                  <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-10 flex justify-center">
                    <div className="max-w-xs w-full bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="w-full h-64 overflow-hidden">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{instructor.name}</h3>
                        <p className="text-blue-600 font-medium mb-3">{instructor.title}</p>
                        <p className="text-gray-600 text-sm mb-6 italic">{instructor.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="instructors" ref={sectionRef} className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Simple gradient header */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-teal-500 transform -skew-y-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-20">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium mb-4">
            EXPERT EDUCATORS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Your Instructors</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
            Learn from experienced teachers who have helped thousands master English phonics and communication skills
          </p>

          {/* Error banner for general/data errors - visible to all users */}
          {error && errorType !== ERROR_TYPES.PERMISSION && errorType !== ERROR_TYPES.NETWORK && (
            <div className="mt-4 max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-red-800 font-medium">There was a problem loading some instructor information</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Controls - Only visible to admin */}
          {isAdmin && currentUser?.email === "inspiringshereen@gmail.com" && (
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={() => toggleEditMode()}
                className={`px-5 py-2.5 rounded-md font-medium transition-all ${editMode
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {editMode ? 'Exit Edit Mode' : 'Manage Instructors'}
              </button>

              {editMode && (
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={addNewInstructor}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add New Instructor
                  </button>

                  {hasChanges && (
                    <button
                      onClick={saveStatusChanges}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition flex items-center"
                      disabled={isUploading}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      Save Status Changes
                    </button>
                  )}
                </div>
              )}

              {saveStatus && (
                <div className={`mt-3 text-sm font-medium ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'
                  }`}>
                  {saveStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editing Form */}
        {editMode && editingInstructor && (
          <div className="max-w-2xl mx-auto mb-16 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingInstructor.id ? 'Edit Instructor' : 'Add New Instructor'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editingInstructor.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructor's name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={editingInstructor.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Phonics Expert & Lead Instructor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingInstructor.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description (1-2 sentences)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editingInstructor.bio || ''}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Detailed biography"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise (comma-separated)</label>
                <input
                  type="text"
                  value={(editingInstructor.expertise || []).join(', ')}
                  onChange={(e) => handleExpertiseChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Phonics Teaching, English Pronunciation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                {imagePreview && (
                  <div className="mb-2">
                    <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-md" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 400x400px (square). Will be displayed in a 1:1 ratio.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={saveInstructor}
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Instructor
                    </>
                  )}
                </button>

                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                {editingInstructor.id && editingInstructor.id !== 'default' && editingInstructor.id !== 'pending' && (
                  <button
                    onClick={() => deleteInstructor(editingInstructor.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition ml-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructors Grid - Modified for better centering with single instructor */}
        <div className="flex justify-center">
          <div className={`grid ${instructors.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8 md:gap-10`}>
            {instructors.map((instructor) => {
              // Skip inactive instructors unless in edit mode
              if (instructor.status === 'inactive' && !editMode) return null;

              // Current status (from pending changes or instructor object)
              const currentStatus = pendingStatusChanges[instructor.id] !== undefined
                ? pendingStatusChanges[instructor.id]
                : instructor.status;

              return (
                <div
                  key={instructor.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-lg ${editMode && currentStatus === 'inactive' ? 'opacity-60' : ''
                    } w-full min-w-[280px]`}
                >
                  {/* Admin controls overlay in edit mode */}
                  {editMode && (
                    <div className="absolute top-2 right-2 z-50 flex space-x-2">
                      <button
                        onClick={() => toggleInstructorStatus(instructor.id)}
                        className={`p-2 rounded-full ${currentStatus === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        title={currentStatus === 'active' ? 'Deactivate instructor' : 'Activate instructor'}
                      >
                        {currentStatus === 'active' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => handleEditInstructor(instructor)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                        title="Edit instructor"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Instructor image */}
                  <div className="relative overflow-hidden h-72">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {editMode && (
                      <div className={`absolute bottom-0 left-0 right-0 text-center py-1 text-xs font-medium text-white ${currentStatus === 'active' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {currentStatus === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    )}
                  </div>

                  {/* Instructor details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{instructor.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{instructor.title}</p>
                    <p className="text-gray-600 text-sm mb-6 italic">{instructor.description}</p>

                    {/* Only show these details when an instructor is active or in edit mode */}
                    {(currentStatus === 'active' || editMode) && (
                      <>
                        {instructor.expertise && instructor.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {instructor.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setActiveInstructor(instructor)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center group"
                        >
                          Read Bio
                          <svg
                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for instructor bio - Fixed to prevent scrolling */}
        {activeInstructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-hidden">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">{activeInstructor.name}</h3>
                <button
                  onClick={() => setActiveInstructor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={activeInstructor.image}
                      alt={activeInstructor.name}
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-600 mb-2">{activeInstructor.title}</h4>
                    <p className="text-gray-700 mb-4">{activeInstructor.description}</p>
                    <div className="prose text-gray-700">
                      <p>{activeInstructor.bio}</p>
                    </div>

                    {activeInstructor.expertise && activeInstructor.expertise.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h5>
                        <div className="flex flex-wrap gap-2">
                          {activeInstructor.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
                <button
                  onClick={() => setActiveInstructor(null)}
                  className="px-4 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export default Instructors;