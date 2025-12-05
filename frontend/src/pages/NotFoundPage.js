import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black dot-grid flex items-center justify-center p-4">
      <div className="text-center">
        <span className="monospace-label mb-4">{"// ERROR"}</span>
        <h1 className="text-8xl font-serif text-black dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-serif text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="btn-ghost inline-flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/app/dashboard"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
