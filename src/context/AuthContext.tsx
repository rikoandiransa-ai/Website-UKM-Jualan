import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; address?: string }) => Promise<{ success: boolean; message: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('umkm_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('umkm_user', JSON.stringify(res.data.data));
      } else {
        logout();
      }
    } catch {
      // If token is invalid or request fails, perform clean logout
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data.success) {
        const { token: newTok, user: userData } = res.data.data;
        localStorage.setItem('umkm_token', newTok);
        localStorage.setItem('umkm_user', JSON.stringify(userData));
        setToken(newTok);
        setUser(userData);
        return { success: true, message: res.data.message || 'Login berhasil' };
      }
      return { success: false, message: res.data.message || 'Login gagal' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Email atau password salah';
      return { success: false, message: msg };
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        const { token: newTok, user: userData } = res.data.data;
        localStorage.setItem('umkm_token', newTok);
        localStorage.setItem('umkm_user', JSON.stringify(userData));
        setToken(newTok);
        setUser(userData);
        return { success: true, message: res.data.message || 'Pendaftaran berhasil' };
      }
      return { success: false, message: res.data.message || 'Pendaftaran gagal' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Pendaftaran gagal';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('umkm_token');
    localStorage.removeItem('umkm_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string; address?: string }) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('umkm_user', JSON.stringify(res.data.data));
        return { success: true, message: 'Profil berhasil diperbarui' };
      }
      return { success: false, message: res.data.message || 'Gagal memperbarui profil' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Gagal memperbarui profil' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
