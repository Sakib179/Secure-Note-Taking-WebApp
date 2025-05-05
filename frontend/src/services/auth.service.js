// Authentication service 
import api from '../utils/api';
// import { jwtDecode } from 'jwt-decode';
import jwt_decode from 'jwt-decode';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.status === 'success') {
      localStorage.setItem('authToken', response.data.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.status === 'success') {
      localStorage.setItem('authToken', response.data.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('authToken');
  window.location = '/login';
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    // Check if token is expired
    // const decodedToken = jwtDecode(token);
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('authToken');
};