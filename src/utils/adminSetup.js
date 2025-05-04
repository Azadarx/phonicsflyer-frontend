// src/utils/adminSetup.js
// This is a utility function you can call in your app initialization

import { getDatabase, ref, set, get } from 'firebase/database';

/**
 * Sets up admin status for a user if they match the admin email
 * @param {Object} user - Firebase auth user object
 * @param {String} adminEmail - Email address of the admin user
 */
export const setupAdminUser = async (user, adminEmail) => {
  if (!user || user.email !== adminEmail) return false;
  
  try {
    const database = getDatabase();
    const userRef = ref(database, `users/${user.uid}`);
    
    // Try to get existing user data
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      // Update existing user with admin flag
      const userData = snapshot.val();
      if (!userData.isAdmin) {
        await set(userRef, {
          ...userData,
          isAdmin: true
        });
        console.log("Updated existing user with admin privileges");
      }
    } else {
      // Create new user with admin privileges
      await set(userRef, {
        fullName: user.displayName || 'Admin',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        isAdmin: true
      });
      console.log("Created new admin user in database");
    }
    
    return true;
  } catch (error) {
    console.error("Failed to set up admin user:", error);
    return false;
  }
};