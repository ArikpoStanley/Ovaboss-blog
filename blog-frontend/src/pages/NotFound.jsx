import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="space-y-6">
            {/* Error Code */}
            <div className="relative">
              <h1 className="text-8xl sm:text-9xl font-bold text-gray-200">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Page Not Found</h2>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="flex justify-center py-4">
              <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20Z" fill="#F3F4F6"/>
                <path d="M140 70C140 75.5 135.5 80 130 80C124.5 80 120 75.5 120 70C120 64.5 124.5 60 130 60C135.5 60 140 64.5 140 70Z" fill="#9CA3AF"/>
                <path d="M80 70C80 75.5 75.5 80 70 80C64.5 80 60 75.5 60 70C60 64.5 64.5 60 70 60C75.5 60 80 64.5 80 70Z" fill="#9CA3AF"/>
                <path d="M140 130C140 147.7 125.7 162 108 162H92C74.3 162 60 147.7 60 130" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* Message */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                We couldn't find the page you're looking for. It might have been moved or doesn't exist.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                  <ArrowLeft size={18} />
                  <span>Go Back</span>
                </button>
                <a 
                  href="/" 
                  className="flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;