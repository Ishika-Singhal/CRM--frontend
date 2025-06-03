import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import the AuthContext

/**
 * Custom hook `useAuth` to easily access authentication context values.
 * This hook simplifies consuming the AuthContext in functional components.
 * @returns {Object} An object containing user, isAuthenticated, isLoading, login, and logout functions.
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  // Throw an error if useAuth is used outside of an AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;