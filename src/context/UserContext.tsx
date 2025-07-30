import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User provider component that manages user profile state
 * @param children - Child components
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    // Check if there's a saved user profile in localStorage
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user profile:', error);
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = user !== null;

  /**
   * Set user profile and save to localStorage
   * @param newUser - User profile to set
   */
  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('userProfile', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('userProfile');
    }
  };

  /**
   * Update specific fields of user profile
   * @param updates - Partial user profile updates
   */
  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('userProfile', JSON.stringify(user));
    }
  }, [user]);

  const value = {
    user,
    setUser,
    updateUser,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook to use user context
 * @returns User context value
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}