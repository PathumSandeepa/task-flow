import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { isAxiosError } from 'axios';
import type { LoginDto, AuthResponse } from '@task-flow/types';

export function useAuth() {
  const { token, signup, login: setToken, logout, error, setError, setLoading } = useStore();

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      setToken(data.access_token);
      return true;
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
        return false;
      }
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    error,
  };
}
