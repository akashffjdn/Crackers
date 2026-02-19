import axios from 'axios';

// Define your backend API base URL
//const API_BASE_URL = 'https://crackers-backend-443415591723.asia-south2.run.app/api'; // Make sure backend runs on 5001
const API_BASE_URL = 'http://localhost:5001/api'

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor to add JWT token to requests ---
api.interceptors.request.use(
  (config) => {
    // Attempt to get the token from local storage
    let token: string | null = null;
    try {
      // Use the key where AuthContext stores the token
      token = localStorage.getItem('crackers_user_token');
    } catch (e) {
      console.error("Error reading token from local storage", e);
    }

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// --- Interceptor for response errors (optional) ---
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request - 401. Clearing token/session.');
      // Clear potentially invalid token/user data
      localStorage.removeItem('crackers_user_token');
      localStorage.removeItem('crackers_user_profile');
      // Optionally force redirect to login
      // window.location.href = '/login';
    }
    // Reject the promise so the calling code can handle the specific error
    return Promise.reject(error);
  }
);

export default api;
