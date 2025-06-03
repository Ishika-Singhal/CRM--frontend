import React from 'react';
import useAuth from '../hooks/useAuth'; 
const AuthStatus = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-gray-600">Loading user...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-2">
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-indigo-500"
          />
        )}
        <span className="text-gray-700 font-medium hidden sm:block">
          Welcome, {user.displayName || user.email}!
        </span>
      </div>
    );
  }

  return <div className="text-gray-500">Not logged in.</div>;
};

export default AuthStatus;