import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { apiRequest } from '@/lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const data = await apiRequest<UserProfile>('/profile');
      setProfile(data);
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gapzero_auth_token');
      const savedUser = localStorage.getItem('gapzero_user');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          await refreshProfile();
        } catch (e) {
          console.error('Session restore error:', e);
          localStorage.removeItem('gapzero_auth_token');
          localStorage.removeItem('gapzero_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Create session token
      const sessionUser: User = {
        id: 'user_' + btoa(email).replace(/=/g, '').slice(0, 16),
        email,
      };
      const token = 'mock-jwt-' + btoa(JSON.stringify(sessionUser));
      
      localStorage.setItem('gapzero_auth_token', token);
      localStorage.setItem('gapzero_user', JSON.stringify(sessionUser));
      
      setUser(sessionUser);
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const sessionUser: User = {
        id: 'user_' + btoa(email).replace(/=/g, '').slice(0, 16),
        email,
      };
      const token = 'mock-jwt-' + btoa(JSON.stringify(sessionUser));

      localStorage.setItem('gapzero_auth_token', token);
      localStorage.setItem('gapzero_user', JSON.stringify(sessionUser));
      setUser(sessionUser);

      // Create initial profile
      const newProf = await apiRequest<UserProfile>('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: name, email }),
      });
      setProfile(newProf);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    setLoading(true);
    try {
      const demoUser: User = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'demo@gapzero.ai',
      };
      localStorage.setItem('gapzero_auth_token', 'demo-token');
      localStorage.setItem('gapzero_user', JSON.stringify(demoUser));
      setUser(demoUser);
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gapzero_auth_token');
    localStorage.removeItem('gapzero_user');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const updated = await apiRequest<UserProfile>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        loginDemo,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
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
