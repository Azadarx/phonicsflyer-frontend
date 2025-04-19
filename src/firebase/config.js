// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For production, use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAomIvQczK46zHogWrqtaaAWIxVRPgBB9U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "inspiring-shereen-flyer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "inspiring-shereen-flyer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "inspiring-shereen-flyer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "229887462962",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:229887462962:web:7ecebbd02f2f1e185a362b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log(firebaseConfig)

export { auth, db };