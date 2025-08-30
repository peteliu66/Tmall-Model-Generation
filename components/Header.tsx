
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Product Modeler
        </h1>
        <p className="text-center text-gray-400 mt-1">Generate professional model photos for your products instantly.</p>
      </div>
    </header>
  );
};

export default Header;
