// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

const ADMIN_EMAIL = 'inspiringshereen@gmail.com';

// Listen for auth state change
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log('No user is signed in');
    return;
  }
  
  console.log('User is signed in:', user.email);
  
  // Check if the user is the admin
  if (user.email === ADMIN_EMAIL) {
    console.log('Found admin user, setting up admin privileges');
    
    // Set admin status in database
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        // Update existing user
        const userData = snapshot.val();
        await set(userRef, {
          ...userData,
          isAdmin: true
        });
      } else {
        // Create new user with admin privileges
        await set(userRef, {
          fullName: user.displayName || 'Admin',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          isAdmin: true
        });
      }
      
      console.log('Admin privileges set successfully');
    } catch (error) {
      console.error('Error setting admin privileges:', error);
    }
  }
});

export { app, auth, database, storage };