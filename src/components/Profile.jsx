// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = () => {
  const { currentUser, getUserData, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
          setRegistrations(data?.registrations || []);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, getUserData]);

  // If not logged in, redirect to home
  if (!currentUser && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-8">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-violet-600">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ml-6 text-white">
                  <h1 className="text-2xl font-bold">{currentUser?.displayName || "User"}</h1>
                  <p className="text-violet-100">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-violet-700"></div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userData?.fullName || currentUser?.displayName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userData?.email || currentUser?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{userData?.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium">
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Registrations</h2>
                  
                  {registrations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {registrations.map((registration, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {registration.referenceId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {registration.date || (registration.timestamp ? new Date(registration.timestamp).toLocaleDateString() : "Unknown")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {registration.amount || "₹99"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {registration.paymentStatus || "Confirmed"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No registrations yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your registrations for masterclasses and workshops will appear here.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;