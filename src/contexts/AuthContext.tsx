import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../services/api';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize loading as true
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing token and user data on mount
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          try {
            // Verify token with backend
            const result = await AuthAPI.verifyToken(token);
            
            if (result.valid && result.user) {
              setIsAuthenticated(true);
              setUser(result.user);
              // Update stored user just in case
              localStorage.setItem('authUser', JSON.stringify(result.user));
            } else {
              throw new Error('Token invalid');
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
           setIsAuthenticated(false);
           setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const result = await AuthAPI.login(username, pass);
      if (result.success && result.token && result.user) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('authUser', JSON.stringify(result.user));
        // Clear legacy
        localStorage.removeItem('adminToken');
        
        setIsAuthenticated(true);
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login Check Failed", error);
      return false;
    }
  };

  const register = async (data: any): Promise<{ success: boolean; message?: string }> => {
      return AuthAPI.register(data);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};