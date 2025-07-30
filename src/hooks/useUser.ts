/**
 * Custom hook for user management
 */

import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

/**
 * Hook to access user context
 * @returns User context value
 */
export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}
