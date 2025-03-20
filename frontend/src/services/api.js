import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Function to retrieve accessToken for authenticated requests
const getAuthToken = async () => {
  return await AsyncStorage.getItem('accessToken');
};

// Request Interceptor to add Authorization header
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { message, accessToken, refreshToken, user }
  } catch (error) {
    throw error.response?.data?.message || 'Login failed. Try again.';
  }
};
