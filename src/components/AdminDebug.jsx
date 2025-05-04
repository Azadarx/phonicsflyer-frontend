// src/components/AdminDebug.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, get, set } from 'firebase/database';

const AdminDebug = () => {
  const { currentUser, isAdmin } = useAuth();

  // Function to force set admin status in the database
  const forceSetAdmin = async () => {
    if (!currentUser) {
      alert('No user logged in!');
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);
      
      // Get existing user data
      const snapshot = await get(userRef);
      let userData = {};
      
      if (snapshot.exists()) {
        userData = snapshot.val();
      }
      
      // Set isAdmin to true
      await set(userRef, {
        ...userData,
        email: currentUser.email,
        fullName: currentUser.displayName || 'Admin User',
        isAdmin: true
      });
      
      alert('Admin status set to TRUE. Please refresh the page.');
    } catch (error) {
      console.error('Error setting admin status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-yellow-100 p-4 border border-yellow-500 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-2">Admin Status Debug</h3>
      <div className="mb-2">
        <strong>User:</strong> {currentUser ? currentUser.email : 'Not logged in'}
      </div>
      <div className="mb-4">
        <strong>Admin Status:</strong> {isAdmin ? 'YES (Admin)' : 'NO (Not Admin)'}
      </div>
      
      <button
        onClick={forceSetAdmin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Force Set Admin
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>If you're having trouble with admin privileges, click the button above.</p>
        <p>Then refresh the page after the confirmation.</p>
      </div>
    </div>
  );
};

export default AdminDebug;