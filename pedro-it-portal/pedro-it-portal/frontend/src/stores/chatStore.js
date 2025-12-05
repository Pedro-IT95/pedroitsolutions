import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isOpen: false,
  error: null,

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  loadHistory: async () => {
    try {
      const { messages } = await api.getAIHistory();
      set({ messages });
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  },

  sendMessage: async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const { message } = await api.sendAIMessage(content);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: message,
        createdAt: new Date().toISOString()
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message || 'Error sending message'
      }));
    }
  },

  clearHistory: async () => {
    try {
      await api.clearAIHistory();
      set({ messages: [] });
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
}));
