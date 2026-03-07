import { ref, computed } from 'vue';
import { authAPI } from './api';

// Global auth state
const currentUser = ref(null);
const isLoading = ref(false);
const error = ref(null);

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
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.me();
      currentUser.value = response.data;
      return response.data;
    } catch (err) {
      currentUser.value = null;
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
