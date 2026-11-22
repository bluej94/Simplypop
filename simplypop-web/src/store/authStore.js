// src/store/authStore.js
import { create } from 'zustand';
import apiClient from '../api/client';

export const useAuthStore = create((set) => ({
  isAdmin: false,
  user: null,
  isLoading: false,  // ✅ Start as false to prevent loading spinner on first visit

  login: async (password) => {
    try {
      const response = await apiClient.post('/login', { password });

      // ✅ Backend sets HttpOnly cookie with JWT token
      // Frontend only stores user info (not the token)
      const { user } = response.data;

      set({ isAdmin: true, user, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.detail || 'Invalid password'
      };
    }
  },

  logout: async () => {
    try {
      // Call backend logout endpoint to clear HttpOnly cookie
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state regardless of API call success
      set({ isAdmin: false, user: null });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });  // ✅ Set loading state when checking
    try {
      // Token is sent automatically via HttpOnly cookie
      // No need to check localStorage
      const response = await apiClient.get('/verify');
      const { user } = response.data;

      set({ isAdmin: true, user, isLoading: false });
    } catch (error) {
      // ✅ Only log if not a 401 (expected when not logged in)
      if (error.response?.status !== 401) {
        console.error('Token verification failed:', error);
      }
      set({ isAdmin: false, user: null, isLoading: false });
    }
  }
}));