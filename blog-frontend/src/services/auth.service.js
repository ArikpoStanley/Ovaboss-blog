import axiosInstance from '../utils/axiosConfig';
import Cookies from 'js-cookie'; // Make sure to install this package with: npm install js-cookie

const API_URL = 'http://localhost:8000';
const USER_COOKIE_NAME = 'XSRF-TOKEN';
const TOKEN_COOKIE_NAME = 'auth_token';
// Default expiration - 7 days
const COOKIE_EXPIRATION = 7;

const AuthService = {
  // Get CSRF token (keeping for backward compatibility)
  getCsrfToken: async () => {
    try {
      // We'll use axiosInstance directly now to utilize our interceptors
      return await axiosInstance.get('/sanctum/csrf-cookie');
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData) => {
    try {
      // Then proceed with registration
      const response = await axiosInstance.post('/register', userData);

      if (response.data.access_token) {
        Cookies.set(TOKEN_COOKIE_NAME, response.data.access_token, { expires: COOKIE_EXPIRATION, secure: true, sameSite: 'strict' });
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(response.data.user), { expires: COOKIE_EXPIRATION, secure: true, sameSite: 'strict' });
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
login: async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    if (response.data.access_token) {
      // Use consistent cookie settings that work better with refreshes
      const cookieOptions = { 
        expires: COOKIE_EXPIRATION,
        secure: window.location.protocol === 'https:', 
        sameSite: 'lax',
        path: '/' // Ensure cookies are available across all paths
      };
      
      Cookies.set(TOKEN_COOKIE_NAME, response.data.access_token, cookieOptions);
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(response.data.user), cookieOptions);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/logout');
      Cookies.remove(TOKEN_COOKIE_NAME);
      Cookies.remove(USER_COOKIE_NAME);
      return { success: true };
    } catch (error) {
      // Even if logout fails on the server, clear cookies
      Cookies.remove(TOKEN_COOKIE_NAME);
      Cookies.remove(USER_COOKIE_NAME);
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/user', userData);
      if (response.data.user) {
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(response.data.user), { expires: COOKIE_EXPIRATION, secure: true, sameSite: 'strict' });
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user from cookies
getCurrentUser: () => {
  try {
    const userStr = Cookies.get(USER_COOKIE_NAME);
    // Debug line to see what's being retrieved
    console.log('Raw cookie value:', userStr);
    
    if (userStr) {
      // Parse safely - sometimes cookies might be URL encoded
      try {
        return JSON.parse(userStr);
      } catch (parseError) {
        console.error('Error parsing user cookie:', parseError);
        // Try decoding if it might be URL encoded
        return JSON.parse(decodeURIComponent(userStr));
      }
    }
    return null;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
},
// Add this to your AuthService
verifyToken: async () => {
  try {
    const response = await axiosInstance.get('/api/verify-token');
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false };
  }
},
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  }
};

export default AuthService;