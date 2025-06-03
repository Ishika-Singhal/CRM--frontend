import React, { createContext, useState, useEffect, useCallback } from 'react';
import crmApi from '../api/crmApi'; // Import your API client

// Create the AuthContext
export const AuthContext = createContext(null);

/**
 * AuthProvider component manages the global authentication state of the application.
 * It fetches the current user status on mount and provides it to its children.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch current user status from backend
  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await crmApi.getCurrentUser();
      if (response.data.isAuthenticated) { // FIX: Access .data.isAuthenticated
        setUser(response.data.user); // FIX: Access .data.user
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user on initial component mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Function to update auth state after successful login (e.g., from Google OAuth callback)
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to clear auth state on logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    fetchCurrentUser // Expose fetchCurrentUser for manual refresh if needed
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

