
import React from 'react';
import type { GeneratedImageData } from '../types';

interface GeneratedImageProps {
  imageData: GeneratedImageData | null;
  isLoading: boolean;
  error: string | null;
  hasProductImage: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="w-full h-full aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageData, isLoading, error, hasProductImage }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 text-center">
        <SkeletonLoader />
        <p className="text-indigo-400">AI is creating your image... this may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (imageData) {
    return (
      <div className="w-full flex flex-col items-center gap-4">
        <img src={imageData.imageUrl} alt={imageData.description} className="w-full h-auto object-contain rounded-lg shadow-lg" />
        <a 
          href={imageData.imageUrl} 
          download="ai-generated-model.png"
          className="w-full max-w-xs text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Download Image
        </a>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-300">Your generated image will appear here</h3>
      <p className="mt-1 text-sm">
        {hasProductImage ? "Configure the model and click 'Generate'." : "Start by uploading a product image."}
      </p>
    </div>
  );
};

export default GeneratedImage;
