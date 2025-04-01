import { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await AuthService.register(userData);
      setCurrentUser(data.user);
      toast.success('Registration successful!');
      navigate('/');
      return data;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await AuthService.login(credentials);
      setCurrentUser(data.user);
      toast.success('Login successful!');
      navigate('/');
      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setCurrentUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const data = await AuthService.updateProfile(userData);
      setCurrentUser(data.user);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
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