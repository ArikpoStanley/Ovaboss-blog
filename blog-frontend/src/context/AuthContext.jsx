/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 const performLogout = useCallback(async (showToast = true) => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with client-side logout even if server logout fails
  } finally {
    setCurrentUser(null);
    if (showToast) {
      toast.success('Logged out successfully');
      navigate('/login');
    }
  }
});
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, try to get CSRF token (important for Laravel Sanctum)
        await AuthService.getCsrfToken();
        
        // Then try to get user from cookie
        const user = AuthService.getCurrentUser();
        
        if (user) {
          console.log('Found user in cookie during initialization:', user);
          setCurrentUser(user);
          
          try {
            const response = await AuthService.verifyToken();
            if (!response.valid) {
              console.log('Token validation failed, logging out');
              await performLogout(false); // Silent logout
            }
          } catch (verifyError) {
            console.warn('Token verification failed, session may be expired', verifyError);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [performLogout]);



  const register = async (userData) => {
    try {
      setLoading(true);
      // Fetch CSRF token before registration
      await AuthService.getCsrfToken();
      const data = await AuthService.register(userData);
      
      // Update user state with the user data from response
      if (data?.user) {
        setCurrentUser(data.user);
      } else if (data?.data?.user) {
        setCurrentUser(data.data.user);
      }
      
      toast.success('Registration successful!');
      navigate('/');
      return data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      // Fetch CSRF token before login
      await AuthService.getCsrfToken();
      const data = await AuthService.login(credentials);
      
      // Update user state with the user data from response
      if (data?.user) {
        setCurrentUser(data.user);
      } else if (data?.data?.user) {
        setCurrentUser(data.data.user);
      }
      
      console.log('User set after login:', currentUser);
      toast.success('Login successful!');
      navigate('/');
      return data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await performLogout(true);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      // Fetch CSRF token before profile update
      await AuthService.getCsrfToken();
      const data = await AuthService.updateProfile(userData);
      
      // Update user state with the updated user data
      if (data?.user) {
        setCurrentUser(data.user);
      } else if (data?.data?.user) {
        setCurrentUser(data.data.user);
      }
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export default function useAuth() {
  return useContext(AuthContext);
}