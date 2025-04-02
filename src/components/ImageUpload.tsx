import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../utils/errorUtils';
import { showSuccessToast, showInfoToast } from './Toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  folder: string;
  userId: string;
  maxSizeMB?: number;
  aspectRatio?: number;
  label?: string;
  imageId?: string;
  error?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  folder,
  userId,
  maxSizeMB = 5,
  aspectRatio,
  label = 'Upload Image',
  imageId = uuidv4(),
  error,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if the image is valid
  const validateImage = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      handleError(
        new Error(`File size exceeds ${maxSizeMB}MB limit`), 
        { fallbackMessage: `Image must be smaller than ${maxSizeMB}MB` }
      );
      return false;
    }
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      handleError(
        new Error('Selected file is not an image'), 
        { fallbackMessage: 'Please select a valid image file (JPG, PNG, etc.)' }
      );
      return false;
    }
    
    return true;
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!validateImage(file)) {
      e.target.value = '';
      return;
    }
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Upload image to Firebase Storage
    await uploadImage(file);
    
    // Clear input
    e.target.value = '';
  };
  
  // Upload image to Firebase Storage
  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a reference with a unique file name
      const fileName = `${imageId}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${userId}/${fileName}`);
      
      // Add metadata
      const metadata = {
        contentType: file.type,
        uploadedBy: userId,
        timestamp: new Date().toISOString(),
      };
      
      // Upload file
      await uploadBytes(storageRef, file, { customMetadata: metadata });
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Call the callback function
      onImageUploaded(downloadUrl);
      
      showSuccessToast('Image uploaded successfully');
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to upload image' });
      // If preview was set but upload failed, reset preview
      if (previewUrl && !currentImageUrl) {
        setPreviewUrl(currentImageUrl || null);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove image
  const handleRemoveImage = async () => {
    if (!previewUrl || !onImageRemoved) return;
    
    try {
      // If the image is already saved (has a Firebase URL), delete it
      if (previewUrl.includes('firebasestorage.googleapis.com')) {
        // Extract file path from URL
        const urlObj = new URL(previewUrl);
        const storagePath = urlObj.pathname.split('/o/')[1];
        
        if (storagePath) {
          // Decode the path
          const decodedPath = decodeURIComponent(storagePath);
          const imageRef = ref(storage, decodedPath);
          
          // Delete the file
          await deleteObject(imageRef);
        }
      }
      
      // Call the callback
      onImageRemoved();
      
      // Clear preview
      setPreviewUrl(null);
      
      showInfoToast('Image removed');
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to remove image' });
    }
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className={`p-4 border-2 border-dashed rounded-lg ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className={`mx-auto max-h-64 max-w-full object-contain rounded ${isUploading ? 'opacity-50' : ''}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                className={`px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                Change Image
              </button>
              
              {onImageRemoved && (
                <button
                  type="button"
                  className={`px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleRemoveImage}
                  disabled={disabled || isUploading}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="flex text-sm text-gray-600">
              <label 
                htmlFor={`file-upload-${imageId}`} 
                className={`relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Upload a file</span>
                <input
                  ref={fileInputRef}
                  id={`file-upload-${imageId}`}
                  name={`file-upload-${imageId}`}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={disabled || isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSizeMB}MB
              {aspectRatio && ` (recommended aspect ratio: ${aspectRatio})`}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
