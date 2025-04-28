// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = () => {
  const { currentUser, getUserData, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
          setEnrollments(data?.enrollments || []);
        } catch (err) {
          // Error handling
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
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-teal-600">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="ml-6 text-white">
                  <h1 className="text-2xl font-bold">{currentUser?.displayName || "Student"}</h1>
                  <p className="text-teal-100">{currentUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-400 border-t-teal-700"></div>
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

                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Course Enrollments</h2>
                  
                  {enrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrollment Date
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
                          {enrollments.map((enrollment, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {enrollment.courseName || "Phonics English"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {enrollment.date || (enrollment.timestamp ? new Date(enrollment.timestamp).toLocaleDateString() : "Unknown")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {enrollment.amount || "₹99"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {enrollment.paymentStatus || "Active"}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No enrollments yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Enroll in our phonics and English speaking courses to see them listed here.
                      </p>
                      <div className="mt-6">
                        <Link to="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                          Browse Courses
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Course Progress Section */}
                  {enrollments.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Course Progress</h2>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {enrollments.map((enrollment, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-gray-800">{enrollment.courseName || "Phonics English"}</h3>
                              <span className="text-sm text-teal-600 font-medium">{enrollment.progressPercentage || "45"}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2.5 rounded-full" 
                                style={{ width: `${enrollment.progressPercentage || 45}%` }}
                              ></div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Next lesson: {enrollment.nextLesson || "Advanced Vowel Sounds"}</p>
                              <p>Scheduled: {enrollment.nextLessonDate || "Tomorrow, 5:00 PM"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Resources */}
                  <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-medium text-teal-600 mb-2">Phonics Practice Worksheets</h3>
                        <p className="text-sm text-gray-600 mb-3">Download these worksheets to practice your phonics skills at home.</p>
                        <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-800">Download PDF</a>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-medium text-teal-600 mb-2">English Pronunciation Guide</h3>
                        <p className="text-sm text-gray-600 mb-3">A comprehensive guide to improve your English pronunciation.</p>
                        <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-800">View Guide</a>
                      </div>
                    </div>
                  </div>
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