import React from 'react';
import type { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
  isLoading: boolean;
}

const GallerySkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
    ))}
  </div>
);

const Gallery: React.FC<GalleryProps> = ({ images, isLoading }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Generation Gallery</h2>
      {isLoading ? (
        <GallerySkeleton />
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={image.image_url} 
                alt={image.prompt || 'Generated model image'}
                className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                 <p className="text-white text-xs line-clamp-3">{image.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-400">No images in the gallery yet.</p>
          <p className="text-xs text-gray-500">Generated images will appear here automatically.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
