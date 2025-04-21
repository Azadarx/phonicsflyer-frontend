import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, rtdb } from '../firebase/config';
import { ref, get, set } from 'firebase/database';
import axios from 'axios';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRTDBData, setUserRTDBData] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (currentUser?.email === 'inspiringshereen@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  const signup = async (email, password, fullName, phone) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName: fullName });

      // Save to Firebase RTDB with full path
      const userRef = ref(rtdb, `users/${uid}`);
      await set(userRef, {
        fullName,
        email,
        phone,
        createdAt: new Date().toISOString()
      });

      // Verify data was written by reading it back
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {

      } else {

      }

      return userCredential.user;
    } catch (err) {
      const friendly = err.code === 'auth/email-already-in-use'
        ? 'That email is already registered. Try signing in instead.'
        : err.message;

      setError(friendly);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if user is disabled from RTDB instead of API call
      const userRef = ref(rtdb, `users/${userCredential.user.uid}`);
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
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getUserData = async () => {
    if (!currentUser) throw new Error('Authentication required');

    // Instead of calling an API endpoint, use Firebase RTDB directly
    try {
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return {
          ...snapshot.val(),
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        };
      } else {
        return {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        };
      }
    } catch (err) {

      throw err;
    }
  };

  const getAllUsers = async () => {
    if (!currentUser) throw new Error('Authentication required');
    if (!isAdmin) throw new Error('Admin access required');

    try {

      const token = await currentUser.getIdToken(true); // Force refresh the token

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


      if (response.data.success) {
        return response.data.users;
      } else {
        throw new Error(response.data.error || 'Failed to fetch users');
      }
    } catch (error) {


      if (error.response) {


      }

      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Try logging out and back in.');
      } else if (error.response?.status === 403) {
        throw new Error('You don\'t have admin permissions.');
      }

      // Fallback to direct RTDB access if API fails
      try {

        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const formattedUsers = Object.entries(usersData).map(([uid, data]) => ({
            id: uid,
            ...data,
            fullName: data.fullName || 'Unknown',
            email: data.email || 'No email',
            disabled: false, // Default value as RTDB doesn't store this
            emailVerified: false // Default value as RTDB doesn't store this
          }));


          return formattedUsers;
        } else {

          return [];
        }
      } catch (rtdbError) {

        throw error; // Throw the original error
      }
    }
  };

  const toggleUserStatus = async (userId, disabled) => {
    if (!currentUser || !isAdmin) throw new Error('Unauthorized access');

    const token = await currentUser.getIdToken();
    const response = await axios.put(
      `${apiBaseUrl}/api/admin/users/${userId}/toggle-status`,
      { disabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update user status');
    }

    return true;
  };

  const deleteUserAccount = async (userId) => {
    if (!currentUser || !isAdmin) throw new Error('Unauthorized access');

    const token = await currentUser.getIdToken();
    const response = await axios.delete(
      `${apiBaseUrl}/api/admin/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete user');
    }

    return true;
  };

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
      const userRef = ref(rtdb, `users/${currentUser.uid}/registrations/${referenceId}`);
      await set(userRef, registrationData);

      // Update via API as well
      const updateResponse = await axios.post(
        `${apiBaseUrl}/api/user/registrations`,
        { referenceId, ...orderData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.data && !updateResponse.data.success) {

      }

      return true;
    } catch (err) {

      throw new Error(err.message || 'Failed to update registration');
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        // Get ID token result to check custom claims
        const idTokenResult = await currentUser.getIdTokenResult();

        // Check for admin claim or match specific email
        if (idTokenResult.claims.admin || currentUser.email === 'inspiringshereen@gmail.com') {

          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {

        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      setCurrentUser(user);

      // If user is logged in, fetch their RTDB data
      if (user) {
        try {

          const userRef = ref(rtdb, `users/${user.uid}`);
          const snapshot = await get(userRef);


          if (snapshot.exists()) {
            const rtdbData = {
              ...snapshot.val(),
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            };

            setUserRTDBData(rtdbData);
          } else {

            // Initialize empty user data
            setUserRTDBData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            });
          }
        } catch (err) {

        }
      } else {
        // Reset RTDB data if user logs out
        setUserRTDBData(null);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    isAdmin,
    userRTDBData, // ✅ Expose RTDB data
    login,
    signup,
    logout,
    error,
    setError,
    getUserData,
    getAllUsers,
    toggleUserStatus,
    deleteUserAccount,
    updateUserRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}