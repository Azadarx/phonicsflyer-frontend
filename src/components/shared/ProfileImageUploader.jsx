import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadFile } from '../services/cloudinaryService';

const ProfileImageUploader = ({ onUpdate, className = '' }) => {
  const { currentUser, userRTDBData, setError } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(
    userRTDBData?.photoURL || currentUser?.photoURL || '/default-avatar.png'
  );

  // Update preview URL when user data changes
  useEffect(() => {
    if (userRTDBData?.photoURL) {
      setPreviewUrl(userRTDBData.photoURL);
    } else if (currentUser?.photoURL) {
      setPreviewUrl(currentUser.photoURL);
    }
  }, [userRTDBData, currentUser]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or GIF).');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB.');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique ID for the user's profile image
      const publicId = `profile_${currentUser.uid}`;
      
      // Upload to Cloudinary using the service
      const result = await uploadFile(file, {
        folder: 'profile_images',
        publicId,
        onProgress: (percent) => setUploadProgress(percent)
      });
      
      // Call the onUpdate callback with the Cloudinary URL
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(result.secure_url);
      }
      
      // Success message can be handled by the parent component
    } catch (error) {
      console.error('Profile image upload failed:', error);
      setError(error.message || 'Failed to upload profile image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Alternative implementation using the FileUploader component
  const handleUploadComplete = (result) => {
    if (result && result.secure_url) {
      setPreviewUrl(result.secure_url);
      
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(result.secure_url);
      }
    }
  };

  return (
    <div className={`profile-image-uploader ${className}`}>
      <div className="avatar-container mb-4 relative">
        <div className="avatar-image w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="text-white text-xs font-medium">
              {uploadProgress}%
            </div>
          </div>
        )}
      </div>
      
      {/* Option 1: Basic file input */}
      {/* 
      <div className="flex justify-center">
        <label 
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Change Photo'}
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>
      */}
      
      {/* Option 2: Using FileUploader component */}
      <div className="flex justify-center">
        <FileUploader
          type={UPLOAD_TYPES.PROFILE}
          onUploadComplete={handleUploadComplete}
          maxSize={2 * 1024 * 1024} // 2MB
          allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
          buttonText="Change Photo"
          className="profile-uploader"
        />
      </div>
    </div>
  );
};

export default ProfileImageUploader;