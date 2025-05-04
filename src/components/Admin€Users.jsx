// AdminUsers.jsx - Improved component with better error handling
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { 
    currentUser, 
    isAdmin, 
    allUsers, 
    toggleUserStatus, 
    deleteUserAccount, 
    fetchUsersData, 
    adminDataStatus 
  } = useAuth();
  const navigate = useNavigate();
  const [actionInProgress, setActionInProgress] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'disabled'

  // Check permission and redirect if not admin
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Initial fetch of users data
    fetchUsersData();
  }, [currentUser, isAdmin, navigate]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  // Handle toggle status (enable/disable)
  const handleToggleStatus = async (userId, disabled) => {
    setActionInProgress(userId);
    setActionError(null);
    
    try {
      await toggleUserStatus(userId, disabled);
    } catch (error) {
      console.error("Error toggling user status:", error);
      setActionError(`Failed to update user status: ${error.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle delete
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    setActionInProgress(userId);
    setActionError(null);
    
    try {
      await deleteUserAccount(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      setActionError(`Failed to delete user: ${error.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter users
  const filteredUsers = allUsers ? allUsers.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'active') return !user.disabled;
    if (filter === 'disabled') return user.disabled;
    return true;
  }) : [];

  // Sort users - admins first, then alphabetically by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Admin users come first
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    
    // Then sort by name
    return (a.fullName || '').localeCompare(b.fullName || '');
  });

  // If not admin or not logged in, don't render anything
  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
        
        {/* Filter controls */}
        <div className="flex items-center mb-6">
          <div className="mr-4">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="disabled">Disabled Users</option>
            </select>
          </div>
          
          <button
            onClick={() => fetchUsersData()}
            className="mt-5 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={adminDataStatus.loading}
          >
            {adminDataStatus.loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Refresh Users</span>
            )}
          </button>
        </div>
        
        {/* Error message */}
        {adminDataStatus.error && (
          <div className="rounded-md bg-yellow-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Admin Access Warning</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{adminDataStatus.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action error message */}
        {actionError && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{actionError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {adminDataStatus.loading && !allUsers && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Users Table */}
      {allUsers && allUsers.length > 0 ? (
        <div className="flex flex-col mt-8">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.photoURL ? (
                                <img className="h-10 w-10 rounded-full" src={user.photoURL} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 font-medium">{(user.fullName || 'U').charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.fullName || 'Unknown Name'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.disabled ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Disabled
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.isAdmin ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Admin
                            </span>
                          ) : (
                            <span>User</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-sm">
                            {user.createdAt && (
                              <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                            )}
                            <div>
                              Email Verified: {user.emailVerified ? (
                                <span className="text-green-600">Yes</span>
                              ) : (
                                <span className="text-red-600">No</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* Don't allow admins to disable themselves or other admins */}
                          {!user.isAdmin && user.id !== currentUser.uid && (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleToggleStatus(user.id, !user.disabled)}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm ${user.disabled ? 'text-white bg-green-600 hover:bg-green-700' : 'text-white bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                disabled={actionInProgress === user.id}
                              >
                                {actionInProgress === user.id ? (
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : user.disabled ? (
                                  'Enable'
                                ) : (
                                  'Disable'
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={actionInProgress === user.id}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                          {(user.isAdmin || user.id === currentUser.uid) && (
                            <span className="text-gray-400 text-xs">
                              {user.id === currentUser.uid ? 'Current User' : 'Admin User'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : !adminDataStatus.loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {adminDataStatus.error ? 'Error loading users data' : 'No users data available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;