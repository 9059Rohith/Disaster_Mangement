import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ darkMode, toggleTheme }) => {
  return (
    <div className="pt-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto py-4 px-6 rounded-full backdrop-blur-lg border border-white/20 bg-black/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:border-cyan-400/50 hover:scale-[1.01]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                DisasterGuard
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="relative font-medium text-gray-200 overflow-hidden group py-2">
              <span className="absolute h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 -bottom-1 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative block group-hover:text-cyan-300 transition-colors duration-300">Home</span>
            </Link>
            
            <Link to="/community" className="relative font-medium text-gray-200 overflow-hidden group py-2">
              <span className="absolute h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 -bottom-1 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative block group-hover:text-cyan-300 transition-colors duration-300">Community</span>
            </Link>
            
            <Link to="/features" className="relative font-medium text-gray-200 overflow-hidden group py-2">
              <span className="absolute h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 -bottom-1 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative block group-hover:text-cyan-300 transition-colors duration-300">Features</span>
            </Link>
            
            <Link to="/developers" className="relative font-medium text-gray-200 overflow-hidden group py-2">
              <span className="absolute h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 -bottom-1 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative block group-hover:text-cyan-300 transition-colors duration-300">Developers</span>
            </Link>
            
            <Link to="/blog" className="relative font-medium text-gray-200 overflow-hidden group py-2">
              <span className="absolute h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 -bottom-1 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative block group-hover:text-cyan-300 transition-colors duration-300">Blog</span>
            </Link>
            
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300 hover:bg-gray-800/50 hover:text-cyan-300 hover:shadow-md hover:shadow-cyan-500/20 hover:scale-110"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/40 border border-transparent hover:border-cyan-400/30"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;