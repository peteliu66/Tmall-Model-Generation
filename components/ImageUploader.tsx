
import React, { useState, useCallback } from 'react';
import type { ProductImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: ProductImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      setPreview(null);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
      onImageUpload({ base64, mimeType });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };


  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-200 mb-3">1. Upload Product Image</h2>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full h-48 px-4 transition bg-gray-700/50 border-2 ${isDragging ? 'border-indigo-400' : 'border-gray-600'} border-dashed rounded-md cursor-pointer hover:border-indigo-500`}
      >
        {preview ? (
          <img src={preview} alt="Product preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l4 4m0 0l4 4m-4-4v12m-12 4h.01M12 28h.01M16 28h.01M20 28h.01M24 28h.01M12 32h.01M16 32h.01M20 32h.01M24 32h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          </div>
        )}
        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
      </label>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
