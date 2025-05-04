// src/services/cloudinaryService.js
import axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {string} options.folder - Optional folder to upload to
 * @param {Function} options.onProgress - Optional progress callback
 * @returns {Promise<Object>} - The upload response data
 */
export const uploadFile = async (file, options = {}) => {
  const { folder = '', onProgress } = options;
  
  // Create form data for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  if (folder) {
    formData.append('folder', folder);
  }
  
  // Add public_id if needed
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  
  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(error.response?.data?.error?.message || 'Upload failed');
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} The deletion response
 */
export const deleteFile = async (publicId) => {
  try {
    // For security reasons, deletion should happen through your backend
    // This is a simplified example - in production, use a server endpoint
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`;
    const response = await axios.post(deleteUrl, {
      public_id: publicId,
      api_key: apiKey,
      timestamp
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error(error.response?.data?.error?.message || 'Delete failed');
  }
};

/**
 * Generates a Cloudinary URL for an image with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} The transformed image URL
 */
export const getImageUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  let transformations = `f_${format},q_${quality}`;
  
  if (width || height) {
    transformations += `,c_${crop}`;
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Creates a signed upload signature for more secure uploads
 * Note: In production, this should be handled by your backend
 * @param {Object} params - Parameters to include in the signature
 * @returns {Object} Object containing signature and timestamp
 */
export const createSignature = async (params = {}) => {
  try {
    // In a real app, this should call your backend API
    // This is a placeholder to show the structure
    const response = await axios.post('/api/cloudinary/signature', params);
    return response.data;
  } catch (error) {
    console.error('Error creating signature:', error);
    throw new Error('Failed to create upload signature');
  }
};

export default {
  uploadFile,
  deleteFile,
  getImageUrl,
  createSignature
};