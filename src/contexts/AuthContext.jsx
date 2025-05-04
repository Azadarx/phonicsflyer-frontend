// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { getDatabase, ref, get, set, onValue, off } from 'firebase/database';
import { auth, database } from '../firebase/config';
import axios from 'axios';
import { uploadFile } from '../components/services/cloudinaryService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // State variables
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false); // Track when admin check is complete
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRTDBData, setUserRTDBData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [allUsers, setAllUsers] = useState(null);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [adminDataStatus, setAdminDataStatus] = useState({ loading: false, error: null });

  // Admin email - this is the only admin user
  const ADMIN_EMAIL = 'inspiringshereen@gmail.com';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Debug log function - helps track auth state
  const logDebug = (message, data = null) => {
    if (import.meta.env.DEV) {
      if (data) {
        console.log(`[AUTH] ${message}`, data);
      } else {
        console.log(`[AUTH] ${message}`);
      }
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Upload profile image to Cloudinary
  const uploadProfileImage = async (file) => {
    if (!currentUser) throw new Error('Authentication required');
    if (!file) throw new Error('No file provided');

    try {
      setUploadProgress(0);

      // Upload to Cloudinary
      const result = await uploadFile(file, {
        folder: 'profile_images',
        publicId: `user_${currentUser.uid}`,
        onProgress: (progress) => setUploadProgress(progress)
      });

      // Update profile with photo URL
      await updateProfile(currentUser, {
        photoURL: result.secure_url
      });

      // Update user data in RTDB
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        await set(userRef, {
          ...userData,
          photoURL: result.secure_url,
          photoPublicId: result.public_id
        });
      }

      // Update local user data
      setUserRTDBData(prev => ({
        ...prev,
        photoURL: result.secure_url,
        photoPublicId: result.public_id
      }));

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign up function
  const signup = async (email, password, fullName, phone, profileImage = null) => {
    try {
      setError('');
      setAuthError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Initialize user data
      let userData = {
        fullName,
        email,
        phone: phone || '',
        createdAt: new Date().toISOString()
      };

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName: fullName });

      // Handle profile image upload if provided
      if (profileImage) {
        try {
          const imageResult = await uploadFile(profileImage, {
            folder: 'profile_images',
            publicId: `user_${uid}`,
            onProgress: (progress) => setUploadProgress(progress)
          });

          // Update user profile with photo URL
          await updateProfile(userCredential.user, {
            photoURL: imageResult.secure_url
          });

          // Add image data to user data
          userData.photoURL = imageResult.secure_url;
          userData.photoPublicId = imageResult.public_id;
        } catch (imageError) {
          console.error("Failed to upload profile image:", imageError);
          // Continue with signup even if image upload fails
        }
      }

      // Save user info to RTDB
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, userData);

      // Verify data was written by reading it back
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        console.error("Data wasn't written properly");
      } else {
        console.log("User data written successfully");
      }

      return userCredential.user;
    } catch (err) {
      const friendly = err.code === 'auth/email-already-in-use'
        ? 'That email is already registered. Try signing in instead.'
        : err.message;

      setError(friendly);
      setAuthError(err.message);
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if user is disabled in RTDB
      const userRef = ref(database, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData?.disabled) {
          await signOut(auth);
          throw new Error('Your account has been disabled. Please contact support.');
        }
      }

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      setAuthError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError('');
      setAuthError(null);
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      setAuthError(err.message);
      throw err;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    setAuthError(null);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      setError(err.message);
      setAuthError(err.message);
      throw err;
    }
  };

  // Get user data from RTDB
  const getUserData = async () => {
    if (!currentUser) throw new Error('Authentication required');

    try {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return {
          ...snapshot.val(),
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL || snapshot.val().photoURL
        };
      } else {
        const newUserData = {
          fullName: currentUser.displayName || '',
          email: currentUser.email,
          createdAt: new Date().toISOString(),
          photoURL: currentUser.photoURL || '',
        };

        await set(userRef, newUserData);
        console.log("Created new user record in RTDB");
        return newUserData;
      }
    } catch (err) {
      setError('Failed to fetch user data');
      throw err;
    }
  };

  // IMPROVED: Check admin status from RTDB with better handling
  const checkAdminStatus = async (user) => {
    if (!user) return false;

    try {
      logDebug(`Checking admin status for: ${user.email}`);

      // First check - simple email comparison (fastest method)
      const isAdminByEmail = user.email === ADMIN_EMAIL;
      
      if (isAdminByEmail) {
        logDebug("Admin status determined by email match");
      }

      // Second check - verify in RTDB
      let isAdminInRTDB = false;
      try {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          isAdminInRTDB = userData.isAdmin === true;
          
          logDebug(`Admin status found in RTDB: ${isAdminInRTDB}`);
          
          // If user is admin by email but not yet in RTDB, update RTDB
          if (isAdminByEmail && !isAdminInRTDB) {
            try {
              await set(ref(database, `users/${user.uid}/isAdmin`), true);
              logDebug("Updated admin status in RTDB");
              isAdminInRTDB = true;
            } catch (writeErr) {
              logDebug(`Could not update admin status in RTDB: ${writeErr.message}`);
            }
          }
        } else if (isAdminByEmail) {
          // Create new user record with admin flag
          try {
            await set(ref(database, `users/${user.uid}`), {
              fullName: user.displayName || 'Admin',
              email: user.email,
              createdAt: new Date().toISOString(),
              photoURL: user.photoURL || '',
              isAdmin: true
            });
            logDebug("Created new admin user in RTDB");
            isAdminInRTDB = true;
          } catch (createErr) {
            logDebug(`Could not create admin in RTDB: ${createErr.message}`);
          }
        }
      } catch (rtdbErr) {
        logDebug(`Error checking admin in RTDB: ${rtdbErr.message}`);
        // Fall back to email check if RTDB fails
      }

      // Return true if either check passes
      return isAdminByEmail || isAdminInRTDB;
    } catch (err) {
      logDebug(`Error in admin check: ${err.message}`);
      // Last resort fallback
      return user.email === ADMIN_EMAIL;
    } finally {
      // Signal that admin check is complete regardless of outcome
      setAdminCheckComplete(true);
    }
  };

  // Update user profile data
  const updateUserProfile = async (profileData) => {
    if (!currentUser) throw new Error('Authentication required');

    try {
      const updates = {};

      // Update display name if provided
      if (profileData.displayName) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName
        });
        updates.fullName = profileData.displayName;
      }

      // Handle other profile fields
      if (profileData.phone) updates.phone = profileData.phone;
      if (profileData.bio) updates.bio = profileData.bio;

      // Update in RTDB if we have any updates
      if (Object.keys(updates).length > 0) {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          await set(userRef, {
            ...userData,
            ...updates
          });
        }

        // Update local user data
        setUserRTDBData(prev => ({
          ...prev,
          ...updates
        }));
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // IMPROVED: Get all users with better error logging
  const getAllUsers = async () => {
    if (!currentUser) throw new Error('Authentication required');
    if (!isAdmin) throw new Error('Admin access required');

    try {
      logDebug("Attempting to fetch all users...");

      // Try the API method first
      try {
        // Force refresh the token to ensure it's not expired
        const token = await currentUser.getIdToken(true);
        
        logDebug("Making API request to fetch users with fresh token");
        const response = await axios.get(
          `${apiBaseUrl}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        if (response.data && response.data.success && Array.isArray(response.data.users)) {
          logDebug(`API returned ${response.data.users.length} users successfully`);
          return response.data.users;
        } else {
          logDebug("API response format unexpected:", response.data);
          // Continue to fallback method
        }
      } catch (apiError) {
        const status = apiError.response?.status;
        const errorMsg = apiError.response?.data?.error || apiError.message;
        
        logDebug(`API fetch failed: Status ${status}, Message: ${errorMsg}`);
        
        // Provide more detailed error for debugging
        if (status === 403) {
          logDebug("403 Forbidden: Token might be valid but user lacks admin privileges on server");
        } else if (status === 401) {
          logDebug("401 Unauthorized: Token might be invalid or expired");
        }
        
        // Continue to fallback method
      }

      // Fallback to database method - try to get all users if admin
      try {
        if (currentUser.email === ADMIN_EMAIL) {
          logDebug("Using RTDB method to fetch all users");
          const usersRef = ref(database, 'users');
          const snapshot = await get(usersRef);

          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersArray = Object.entries(usersData).map(([id, data]) => ({
              id,
              ...data,
              fullName: data.fullName || 'Unknown',
              email: data.email || 'No email',
              disabled: data.disabled || false
            }));

            logDebug(`RTDB returned ${usersArray.length} users`);
            return usersArray;
          } else {
            logDebug("No users found in RTDB");
          }
        }
      } catch (rtdbError) {
        const errorMsg = rtdbError.message;
        logDebug(`RTDB fallback failed: ${errorMsg}`);
        
        if (errorMsg.includes("permission_denied")) {
          logDebug("Permission denied: Check Firebase RTDB security rules");
        }
        // Continue to single-user fallback
      }

      // Last fallback: just get current user's data
      logDebug("Using fallback method to fetch only current user data");
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        return [{
          id: currentUser.uid,
          ...userData,
          fullName: userData.fullName || currentUser.displayName || 'Unknown',
          email: userData.email || currentUser.email || 'No email',
          disabled: userData.disabled || false,
          emailVerified: currentUser.emailVerified || false
        }];
      }

      // If all methods fail, return an empty array
      logDebug("All methods failed, returning empty array");
      return [];
    } catch (error) {
      logDebug(`getAllUsers critical error: ${error.message}`);
      throw error;
    }
  };

  // IMPROVED: Safely fetch users data for admin with better error handling
  const fetchUsersData = async () => {
    if (!currentUser || !isAdmin) return;

    try {
      logDebug("Beginning user data fetch process...");
      // Track if we're already fetching to prevent duplicate requests
      if (fetchingUsers) {
        logDebug("Already fetching users data, skipping");
        return;
      }

      setFetchingUsers(true);

      // Add a subtle loading indicator for admin panel
      setAdminDataStatus({ loading: true, error: null });

      const users = await getAllUsers();

      if (Array.isArray(users)) {
        setAllUsers(users);
        logDebug(`Fetched ${users.length} users successfully`);

        // If we only got the current user but should have more, show a warning
        if (users.length === 1 && users[0].id === currentUser.uid && currentUser.email === ADMIN_EMAIL) {
          setAdminDataStatus({
            loading: false,
            error: "Limited permissions: Only your own data is available. Check server-side admin verification or Firebase rules."
          });
        } else {
          setAdminDataStatus({ loading: false, error: null });
        }
      } else {
        logDebug("getAllUsers returned non-array:", users);
        setAllUsers([]);
        setAdminDataStatus({
          loading: false,
          error: "Received invalid user data. Please refresh and try again."
        });
      }
    } catch (error) {
      logDebug(`Error fetching users data: ${error.message}`);
      setAllUsers([]); // Reset to empty array on error
      setAdminDataStatus({
        loading: false,
        error: `Error loading users: ${error.message}. Please try again later.`
      });
    } finally {
      setFetchingUsers(false);
    }
  };

  // Toggle user status (enable/disable)
  const toggleUserStatus = async (userId, disabled) => {
    if (!currentUser || !isAdmin) throw new Error('Unauthorized access');

    try {
      // First, update in RTDB directly (this is faster)
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        await set(userRef, {
          ...userData,
          disabled
        });

        // Also update local state if we have it cached
        if (allUsers) {
          setAllUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === userId ? { ...user, disabled } : user
            )
          );
        }
      }

      // Then, also update via API for any server-side processing
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.put(
          `${apiBaseUrl}/api/admin/users/${userId}/toggle-status`,
          { disabled },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.success) {
          logDebug("API update failed, but RTDB update was successful");
        }
      } catch (apiError) {
        logDebug(`API update failed, but RTDB update was successful: ${apiError.message}`);
        // Continue as the RTDB update was successful
      }

      return true;
    } catch (error) {
      logDebug(`Error toggling user status: ${error.message}`);
      throw error;
    }
  };

  // Delete user account (admin function)
  const deleteUserAccount = async (userId) => {
    if (!currentUser || !isAdmin) throw new Error('Unauthorized access');

    try {
      // First update RTDB
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, null);

      // Then update via API
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.delete(
          `${apiBaseUrl}/api/admin/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.success) {
          logDebug("API deletion failed, but RTDB deletion was successful");
        }
      } catch (apiError) {
        logDebug(`API deletion failed, but RTDB deletion was successful: ${apiError.message}`);
      }

      // Update local state if we have it cached
      if (allUsers) {
        setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      }

      return true;
    } catch (error) {
      logDebug(`Error deleting user account: ${error.message}`);
      throw error;
    }
  };

  // Update user registration
  const updateUserRegistration = async (referenceId, orderData) => {
    if (!currentUser) throw new Error('Authentication required');

    const token = await currentUser.getIdToken();
    const registrationData = {
      referenceId,
      ...orderData,
      timestamp: new Date().toISOString()
    };

    try {
      // Update the user's registrations in RTDB
      const userRef = ref(database, `users/${currentUser.uid}/registrations/${referenceId}`);
      await set(userRef, registrationData);

      // Update via API as well
      const updateResponse = await axios.post(
        `${apiBaseUrl}/api/user/registrations`,
        { referenceId, ...orderData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.data && !updateResponse.data.success) {
        logDebug(`API registration update failed: ${updateResponse.data.error}`);
      }

      return true;
    } catch (err) {
      logDebug(`Error updating registration: ${err.message}`);
      throw new Error(err.message || 'Failed to update registration');
    }
  };

  // Get user registrations
  const getUserRegistrations = async () => {
    if (!currentUser) throw new Error('Authentication required');

    try {
      const registrationsRef = ref(database, `users/${currentUser.uid}/registrations`);
      const snapshot = await get(registrationsRef);

      if (snapshot.exists()) {
        const registrations = snapshot.val();
        return Object.entries(registrations).map(([id, data]) => ({
          id,
          ...data
        }));
      } else {
        return [];
      }
    } catch (error) {
      logDebug(`Error fetching user registrations: ${error.message}`);
      throw error;
    }
  };

  // FIXED: Replace real-time listeners with safe polling for admin
  useEffect(() => {
    if (!currentUser || !isAdmin || !adminCheckComplete) return;

    logDebug("Admin status confirmed, setting up admin data fetch");
    
    // Initial fetch
    fetchUsersData();

    // Set up polling instead of real-time listener
    const pollingInterval = setInterval(() => {
      fetchUsersData();
    }, 60000); // Poll every minute

    return () => {
      clearInterval(pollingInterval);
    };
  }, [currentUser, isAdmin, adminCheckComplete]); // Added adminCheckComplete dependency

  // Subscribe to auth state changes
  useEffect(() => {
    logDebug("Setting up auth state listener");
    setLoading(true); // Ensure loading is true when we start

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      logDebug(`Auth state changed, user: ${user?.email || 'No user'}`);

      if (user) {
        setCurrentUser(user);
        setAdminCheckComplete(false); // Reset admin check status

        // Check admin status and update the state
        const adminStatus = await checkAdminStatus(user);
        logDebug(`Setting admin status: ${adminStatus}`);
        setIsAdmin(adminStatus);

        // Set up real-time listener for current user's data
        const userRef = ref(database, `users/${user.uid}`);
        
        const userListener = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserRTDBData(userData);
            logDebug("Updated user data from real-time listener");
            
            // Double-check admin status from RTDB data
            if (userData.isAdmin === true && !isAdmin) {
              logDebug("Admin status updated from user data listener");
              setIsAdmin(true);
            }
          } else {
            // Handle case where user exists in auth but not in RTDB
            setUserRTDBData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            });
            logDebug("User exists in auth but not in RTDB");
          }
          
          // FIXED: Always set loading to false after processing user data
          setLoading(false);
        }, (error) => {
          logDebug(`Error in real-time user data listener: ${error.message}`);
          // FIXED: Still set loading to false even if there's an error
          setLoading(false);
        });
        
        // Return cleanup function for the user data listener
        return () => {
          logDebug("Cleaning up user data listener");
          off(userRef);
        };
      } else {
        logDebug("No user signed in - resetting states");
        setCurrentUser(null);
        setIsAdmin(false);
        setAdminCheckComplete(true); // No admin check needed when logged out
        setUserRTDBData(null);
        setAllUsers(null);
        // FIXED: Set loading to false for the no user case
        setLoading(false);
      }
    }, (authError) => {
      logDebug(`Error in auth state observer: ${authError.message}`);
      setLoading(false); // Ensure we're not stuck in loading state
    });

    // Cleanup subscription
    return () => {
      logDebug("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    currentUser,
    isAdmin,
    loading,
    adminCheckComplete, // NEW: Expose this so components can check if admin status is finalized
    error,
    authError,
    userRTDBData,
    uploadProgress,
    allUsers,
    adminDataStatus,
    // Auth functions
    signup,
    login,
    logout,
    resetPassword,
    // Data functions
    getUserData,
    getAllUsers,
    toggleUserStatus,
    deleteUserAccount,
    updateUserRegistration,
    getUserRegistrations,
    updateUserProfile,
    // Admin functions
    fetchUsersData,
    // Cloudinary functions
    uploadProfileImage,
    // Utility functions
    setError
  };

  logDebug(`Auth provider rendering - Loading: ${loading}, IsAdmin: ${isAdmin}, AdminCheckComplete: ${adminCheckComplete}`);

  // IMPROVED: Only render children when both loading is false AND admin check is complete
  // This ensures we don't flash incorrect UI state during admin check
  return (
    <AuthContext.Provider value={value}>
      {!loading && adminCheckComplete ? children : (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing application...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;