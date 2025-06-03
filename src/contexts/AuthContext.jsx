import React, { createContext, useState, useEffect, useCallback } from 'react';
import crmApi from '../api/crmApi'; 


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await crmApi.getCurrentUser();
      if (response.data.isAuthenticated) { 
        setUser(response.data.user); 
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

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

 
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };


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
    fetchCurrentUser 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

