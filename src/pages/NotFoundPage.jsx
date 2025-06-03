import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component displayed when a route is not found (404).
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-gray-50 text-center px-4 py-12">
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Page Not Found
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
