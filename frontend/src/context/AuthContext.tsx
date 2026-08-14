import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    assignedStoreId?: string,
    assignedStoreName?: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cams_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('cams_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('cams_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    assignedStoreId?: string,
    assignedStoreName?: string
  ) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
      assignedStoreId,
      assignedStoreName,
    });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('cams_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('cams_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string }) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
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
