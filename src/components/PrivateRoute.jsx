import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import the custom auth hook

/**
 * PrivateRoute component protects routes that require authentication.
 * If the user is authenticated, it renders the child routes.
 * Otherwise, it redirects to the login page.
 */
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optionally show a loading spinner or message while checking auth status
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  // If authenticated, render the nested routes
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;