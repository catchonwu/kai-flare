import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AUTH_CONFIG from '../config/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  enabled?: boolean; // Optional auth - can be disabled
}

export function AuthProvider({ children, enabled = false }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If auth is disabled, provide a mock authenticated state
  const mockUser: User | null = enabled ? null : {
    id: 'guest',
    email: AUTH_CONFIG.guest.email,
    name: AUTH_CONFIG.guest.name,
    createdAt: new Date()
  };

  const isAuthenticated = enabled ? user !== null : true;

  useEffect(() => {
    if (!enabled) {
      setUser(mockUser);
      return;
    }

    // Check for existing session on mount
    checkExistingSession();
  }, [enabled]);

  const checkExistingSession = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      // Check localStorage for user session
      const storedUser = localStorage.getItem('solilop-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (err) {
      console.error('Error checking session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!enabled) {
      throw new Error('Authentication is disabled');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (email === AUTH_CONFIG.demo.email && password === AUTH_CONFIG.demo.password) {
        const userData: User = {
          id: 'demo-user',
          email,
          name: 'Demo User',
          createdAt: new Date()
        };
        
        setUser(userData);
        localStorage.setItem('solilop-user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    if (!enabled) {
      throw new Error('Authentication is disabled');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Mock registration - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        createdAt: new Date()
      };
      
      setUser(userData);
      localStorage.setItem('solilop-user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('solilop-user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user: enabled ? user : mockUser,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    clearError,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;