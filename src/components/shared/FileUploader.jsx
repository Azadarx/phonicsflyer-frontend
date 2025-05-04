import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadFile } from '../services/cloudinaryService';

// Types of uploads this component can handle
const UPLOAD_TYPES = {
  PROFILE: 'profile',
  DOCUMENT: 'document',
  IMAGE: 'image'
};

const FileUploader = ({ 
  onUploadComplete, 
  type = UPLOAD_TYPES.IMAGE,
  folder = '',
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  buttonText = 'Upload File',
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  
  // Generate folder path based on type
  const getFolder = () => {
    if (folder) return folder;
    
    switch (type) {
      case UPLOAD_TYPES.PROFILE:
        return 'profile_images';
      case UPLOAD_TYPES.DOCUMENT:
        return 'documents';
      default:
        return 'images';
    }
  };
  
  // Generate public ID for the uploaded file
  const getPublicId = (file) => {
    const timestamp = new Date().getTime();
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const sanitizedName = fileNameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    if (type === UPLOAD_TYPES.PROFILE && currentUser) {
      return `user_${currentUser.uid}`;
    }
    
    return `${sanitizedName}_${timestamp}`;
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return false;
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(`Unsupported file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    return true;
  };
  
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset states
    setError('');
    setProgress(0);
    
    // Validate file
    if (!validateFile(file)) {
      e.target.value = null; // Clear the input
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Prepare upload options
      const options = {
        folder: getFolder(),
        publicId: getPublicId(file),
        onProgress: (percent) => setProgress(percent)
      };
      
      // Upload file to Cloudinary
      const result = await uploadFile(file, options);
      
      // Call the completion callback with the result
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      
      setProgress(100);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = null; // Clear the input
    }
  };
  
  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  return (
    <div className={`file-uploader ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept={allowedTypes.join(',')}
      />
      
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`upload-button ${isUploading ? 'uploading' : ''}`}
        type="button"
      >
        {isUploading ? `Uploading... ${progress}%` : buttonText}
      </button>
      
      {isUploading && (
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

// Export the component and types
export { FileUploader, UPLOAD_TYPES };
export default FileUploader;