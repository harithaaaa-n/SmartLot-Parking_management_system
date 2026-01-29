import React, { createContext, useContext, useState, useMemo } from 'react';
import { showSuccess } from '@/utils/toast';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage to persist login across refreshes
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const loginAdmin = () => {
    // Simulate successful admin login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", "true");
    setIsLoggedIn(true);
    setIsAdmin(true);
    showSuccess("Admin logged in successfully.");
  };

  const logout = () => {
    // Simulate logout
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    showSuccess("Logged out successfully.");
  };

  const value = useMemo(() => ({
    isLoggedIn,
    isAdmin,
    loginAdmin,
    logout,
  }), [isLoggedIn, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};