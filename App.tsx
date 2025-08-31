import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ModelConfigurator from './components/ModelConfigurator';
import GeneratedImage from './components/GeneratedImage';
import Gallery from './components/Gallery';
import { generateModelImage } from './services/geminiService';
import { uploadGeneratedImage, getGalleryImages } from './services/supabaseService';
import type { ModelConfig, ProductImage, GeneratedImageData, GalleryImage } from './types';
import { DEFAULT_MODEL_CONFIG } from './constants';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<ProductImage | null>(null);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(DEFAULT_MODEL_CONFIG);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState<boolean>(true);

  const fetchGallery = useCallback(async () => {
    setIsGalleryLoading(true);
    const images = await getGalleryImages();
    setGalleryImages(images);
    setIsGalleryLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);


  const handleImageUpload = (image: ProductImage) => {
    setProductImage(image);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!productImage) {
      setError('Please upload a product image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateModelImage(productImage, modelConfig);
      setGeneratedImage(result);

      // After successful generation, upload to Supabase
      if (result.imageUrl) {
        await uploadGeneratedImage(result.imageUrl, modelConfig);
        // Refresh the gallery to show the new image
        await fetchGallery();
      }

    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate image. The AI may have refused the request due to safety policies. Please try a different product or adjust settings.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, modelConfig, fetchGallery]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col gap-6 h-fit">
            <ImageUploader onImageUpload={handleImageUpload} />
            {productImage && (
              <>
                <div className="border-t border-gray-700"></div>
                <ModelConfigurator config={modelConfig} setConfig={setModelConfig} />
                <button
                  onClick={handleGenerateClick}
                  disabled={isLoading || !productImage}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    '✨ Generate Model Image'
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col items-center justify-center min-h-[400px] lg:min-h-0">
            <GeneratedImage 
              imageData={generatedImage} 
              isLoading={isLoading} 
              error={error} 
              hasProductImage={!!productImage}
            />
          </div>
        </div>
        
        {/* Gallery Section */}
        <Gallery images={galleryImages} isLoading={isGalleryLoading} />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini. © 2024 AI Product Modeler</p>
      </footer>
    </div>
  );
};

export default App;