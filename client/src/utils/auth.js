import { ref, computed } from 'vue';
import { authAPI } from './api';

// Global auth state
const currentUser = ref(null);
const isLoading = ref(false);
const error = ref(null);
const lastFetch = ref(0);
const CACHE_DURATION = 30000; // 30 seconds cache

export const useAuth = () => {
  const isAuthenticated = computed(() => !!currentUser.value);

  const register = async (email, password, full_name, role = 'student') => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authAPI.register({
        email,
        password,
        full_name,
        role,
      });
      currentUser.value = response.data;
      lastFetch.value = Date.now();
      return response;
    } catch (err) {
      error.value = err.message || 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authAPI.login({ email, password });
      currentUser.value = response.data;
      lastFetch.value = Date.now();
      return response;
    } catch (err) {
      error.value = err.message || 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      currentUser.value = null;
      lastFetch.value = 0;
    }
  };

  const getCurrentUser = async (forceRefresh = false) => {
    // Return cached user if valid
    if (!forceRefresh && currentUser.value && Date.now() - lastFetch.value < CACHE_DURATION) {
      return currentUser.value;
    }
    
    try {
      const response = await authAPI.me();
      currentUser.value = response.data;
      lastFetch.value = Date.now();
      return response.data;
    } catch (err) {
      currentUser.value = null;
      lastFetch.value = 0;
      throw err;
    }
  };

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
  };
};
