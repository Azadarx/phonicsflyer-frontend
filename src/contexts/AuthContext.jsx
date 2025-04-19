// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Sign up function
  async function signup(email, password, fullName, phone) {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName,
        email,
        phone,
        createdAt: new Date().toISOString(),
        registrations: []
      });

      return userCredential.user;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Sign in function
  async function login(email, password) {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Sign out function
  async function logout() {
    try {
      setError('');
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Get user data from Firestore
  async function getUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No user data found!");
        return null;
      }
    } catch (err) {
      console.error("Get user data error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Update user registrations
  async function updateUserRegistration(referenceId, orderData) {
    try {
      if (!currentUser) return;
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }
      
      const userData = userDoc.data();
      const registrations = userData.registrations || [];
      
      // Add new registration
      registrations.push({
        referenceId,
        ...orderData,
        timestamp: new Date().toISOString()
      });
      
      // Update Firestore
      await setDoc(userDocRef, { ...userData, registrations }, { merge: true });
    } catch (err) {
      console.error("Update registration error:", err);
      setError(err.message);
      throw err;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    error,
    setError,
    getUserData,
    updateUserRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}