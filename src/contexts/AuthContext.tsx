import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Setup API Client with credentials (cookies)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export interface UserType {
  id: string;
  name: string;
  email: string;
  photo?: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
  raisedCredits: number;
  status: 'active' | 'suspended';
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  registerUser: (userData: any) => Promise<void>;
  googleLogin: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, photo: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore Session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        // Silently ignore 401 on reload
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      setUser(response.data.user);
      toast.success(response.data.message || 'Logged in successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      setUser(response.data.user);
      toast.success(response.data.message || 'Registered successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/google-login', userData);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      setUser(response.data.user);
      toast.success(response.data.message || 'Google Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (name: string, photo: string) => {
    try {
      const response = await api.put('/auth/profile', { name, photo });
      setUser(response.data.user);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update profile failed');
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      registerUser,
      googleLogin,
      logout,
      updateProfile,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
