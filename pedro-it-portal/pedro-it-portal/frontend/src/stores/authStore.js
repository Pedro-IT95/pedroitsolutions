import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const { user } = await api.getMe();
      set({ user, isLoading: false, isAuthenticated: true });
    } catch (error) {
      console.error('Auth initialization error:', error);
      api.logout();
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    const { user } = await api.login(email, password);
    set({ user, isAuthenticated: true });
    return user;
  },

  register: async (userData) => {
    const { user } = await api.register(userData);
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: () => {
    api.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData }
    }));
  }
}));
