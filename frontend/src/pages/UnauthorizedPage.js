import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black dot-grid flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center mx-auto mb-6">
          <FiShield className="w-10 h-10 text-white dark:text-black" />
        </div>
        <span className="monospace-label mb-4">{"// FORBIDDEN"}</span>
        <h1 className="text-4xl font-serif text-black dark:text-white mb-2 mt-2">403</h1>
        <h2 className="text-xl font-serif text-gray-700 dark:text-gray-300 mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/app/dashboard"
          className="btn-primary inline-flex items-center gap-2"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
