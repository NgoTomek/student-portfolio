import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../utils/errorUtils';
import { showSuccessToast, showInfoToast } from './Toast';

interface FileUploadProps {
  currentFileUrl?: string;
  currentFileName?: string;
  onFileUploaded: (url: string, fileName: string) => void;
  onFileRemoved?: () => void;
  folder: string;
  userId: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  label?: string;
  fileId?: string;
  error?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  currentFileUrl,
  currentFileName,
  onFileUploaded,
  onFileRemoved,
  folder,
  userId,
  maxSizeMB = 10,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  label = 'Upload File',
  fileId = uuidv4(),
  error,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(currentFileName || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format accepted file types for input
  const acceptAttribute = acceptedFileTypes.join(',');
  
  // Format accepted file types for display
  const acceptedTypesDisplay = acceptedFileTypes
    .map(type => type.replace('.', '').toUpperCase())
    .join(', ');
  
  // Check if the file is valid
  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      handleError(
        new Error(`File size exceeds ${maxSizeMB}MB limit`), 
        { fallbackMessage: `File must be smaller than ${maxSizeMB}MB` }
      );
      return false;
    }
    
    // Check file type
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExt) && !acceptedFileTypes.includes(file.type)) {
      handleError(
        new Error('Unsupported file type'), 
        { fallbackMessage: `Please select a valid file type (${acceptedTypesDisplay})` }
      );
      return false;
    }
    
    return true;
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }
    
    // Save file name
    setFileName(file.name);
    
    // Upload file to Firebase Storage
    await uploadFile(file);
    
    // Clear input
    e.target.value = '';
  };
  
  // Upload file to Firebase Storage
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a reference with a unique file name
      const fileName = `${fileId}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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
      onFileUploaded(downloadUrl, file.name);
      
      showSuccessToast('File uploaded successfully');
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to upload file' });
      // If filename was set but upload failed, reset it
      if (fileName && !currentFileName) {
        setFileName(currentFileName || null);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove file
  const handleRemoveFile = async () => {
    if (!currentFileUrl || !onFileRemoved) return;
    
    try {
      // If the file is already saved (has a Firebase URL), delete it
      if (currentFileUrl.includes('firebasestorage.googleapis.com')) {
        // Extract file path from URL
        const urlObj = new URL(currentFileUrl);
        const storagePath = urlObj.pathname.split('/o/')[1];
        
        if (storagePath) {
          // Decode the path
          const decodedPath = decodeURIComponent(storagePath);
          const fileRef = ref(storage, decodedPath);
          
          // Delete the file
          await deleteObject(fileRef);
        }
      }
      
      // Call the callback
      onFileRemoved();
      
      // Clear file name
      setFileName(null);
      
      showInfoToast('File removed');
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to remove file' });
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
        {fileName ? (
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-white rounded border border-gray-200">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                {currentFileUrl && (
                  <a 
                    href={currentFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View file
                  </a>
                )}
              </div>
              {isUploading && (
                <div className="ml-4">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
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
                Replace File
              </button>
              
              {onFileRemoved && (
                <button
                  type="button"
                  className={`px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleRemoveFile}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="flex text-sm text-gray-600">
              <label 
                htmlFor={`file-upload-${fileId}`} 
                className={`relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Upload a file</span>
                <input
                  ref={fileInputRef}
                  id={`file-upload-${fileId}`}
                  name={`file-upload-${fileId}`}
                  type="file"
                  className="sr-only"
                  accept={acceptAttribute}
                  onChange={handleFileChange}
                  disabled={disabled || isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            
            <p className="text-xs text-gray-500">
              {acceptedTypesDisplay} up to {maxSizeMB}MB
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
