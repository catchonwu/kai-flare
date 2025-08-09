import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AUTH_CONFIG from '../config/auth';
import apiClient from '../api/client';
import { ApiError } from '../api/client';
import { frontendToBackendLop, backendToFrontendLop } from '../utils/lopMapping';
import { lopPersonalities } from '../components/LopCharacter';

export interface User {
  id: string;
  email: string;
  name?: string;
  lopCharacter?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string, lopCharacterId?: string) => Promise<void>;
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
      const storedUser = localStorage.getItem('solilop-user');
      const storedToken = localStorage.getItem('auth-token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        // Restore token in API client
        apiClient.setToken(storedToken);
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt)
        });
      }
    } catch (err) {
      console.error('Error checking session:', err);
      // Clear corrupted data
      localStorage.removeItem('solilop-user');
      localStorage.removeItem('auth-token');
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
      const response = await apiClient.login(email, password);
      
      // Set token in API client
      apiClient.setToken(response.token);
      
      // Convert backend user to frontend format
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.email.split('@')[0], // Extract name from email
        lopCharacter: backendToFrontendLop(response.user.lop_character as any),
        createdAt: new Date(response.user.created_at)
      };
      
      setUser(userData);
      localStorage.setItem('solilop-user', JSON.stringify(userData));
      localStorage.setItem('auth-token', response.token);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Sign in failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string, lopCharacterId?: string) => {
    if (!enabled) {
      throw new Error('Authentication is disabled');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Use provided lopCharacter or default to first one
      const frontendLopId = lopCharacterId || lopPersonalities[0].id;
      const backendLopCharacter = frontendToBackendLop(frontendLopId);
      
      const response = await apiClient.register(email, password, backendLopCharacter);
      
      // Set token in API client
      apiClient.setToken(response.token);
      
      // Convert backend user to frontend format
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: name || email.split('@')[0],
        lopCharacter: backendToFrontendLop(response.user.lop_character as any),
        createdAt: new Date(response.user.created_at)
      };
      
      setUser(userData);
      localStorage.setItem('solilop-user', JSON.stringify(userData));
      localStorage.setItem('auth-token', response.token);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Sign up failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      // Clear API client token
      apiClient.setToken(null);
      
      setUser(null);
      localStorage.removeItem('solilop-user');
      localStorage.removeItem('auth-token');
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