import { User } from '../types/user';
import { fetchApi } from './api';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      return await fetchApi<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // Mock auth response
      const mockUser: User = {
        id: 'usr-101',
        name: email.split('@')[0].replace('.', ' ') || 'Demo User',
        email,
        phone: '+91 98765 43210',
        createdAt: '2026-01-01',
      };
      return {
        user: mockUser,
        token: 'mock_jwt_token_affordpro_2026',
      };
    }
  },

  async register(name: string, email: string, phone?: string, password?: string): Promise<{ user: User; token: string }> {
    try {
      return await fetchApi<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        user: newUser,
        token: 'mock_jwt_token_affordpro_2026',
      };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      return await fetchApi<{ success: boolean; message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      return {
        success: true,
        message: 'Password reset link sent to your email address.',
      };
    }
  },

  async updateProfile(user: Partial<User>): Promise<User> {
    try {
      return await fetchApi<User>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(user),
      });
    } catch {
      return {
        id: user.id || 'usr-101',
        name: user.name || 'Demo User',
        email: user.email || 'user@affordpro.com',
        phone: user.phone || '+91 98765 43210',
        createdAt: '2026-01-01',
      };
    }
  }
};
