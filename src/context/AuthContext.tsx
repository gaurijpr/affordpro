import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/user';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (user: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const savedUser = localStorage.getItem('affordpro_user');
      const savedToken = localStorage.getItem('affordpro_token');
      if (savedUser && savedToken) {
        return {
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          token: savedToken,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      user: null,
      isAuthenticated: false,
      token: null,
    };
  });

  const { showToast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login(email, password);
      setAuthState({
        user: res.user,
        isAuthenticated: true,
        token: res.token,
      });
      localStorage.setItem('affordpro_user', JSON.stringify(res.user));
      localStorage.setItem('affordpro_token', res.token);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone?: string, password?: string): Promise<boolean> => {
    try {
      const res = await authService.register(name, email, phone, password);
      setAuthState({
        user: res.user,
        isAuthenticated: true,
        token: res.token,
      });
      localStorage.setItem('affordpro_user', JSON.stringify(res.user));
      localStorage.setItem('affordpro_token', res.token);
      showToast('Account created successfully! Welcome to AffordPro.', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    localStorage.removeItem('affordpro_user');
    localStorage.removeItem('affordpro_token');
    showToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const updated = await authService.updateProfile(data);
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user, ...updated } as User,
      }));
      localStorage.setItem('affordpro_user', JSON.stringify({ ...authState.user, ...updated }));
      showToast('Profile updated successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to update profile.', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
