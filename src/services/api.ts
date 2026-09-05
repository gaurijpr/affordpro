/**
 * API Service Abstraction Layer
 * Configured with VITE_API_BASE_URL environment variable.
 * Connects directly to real Express + Prisma backend server.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'; // defaults to false when connecting to backend

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (USE_MOCK_DATA) {
    throw new Error('MOCK_MODE_ACTIVE');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Request failed with status ${response.status}`);
  }

  return response.json();
}
