import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',  // ✅ Defaults to /api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // ✅ CRITICAL: Sends HttpOnly cookies with requests
});

// Request interceptor
// ✅ No longer needed - cookies are sent automatically
// Removed localStorage token injection
apiClient.interceptors.request.use(
  (config) => {
    // HttpOnly cookies are automatically included with every request
    // No manual Authorization header needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ No automatic redirects - let React Router and ProtectedRoute handle it
    // This prevents infinite loops and unwanted redirects on public pages
    return Promise.reject(error);
  }
);

export default apiClient;