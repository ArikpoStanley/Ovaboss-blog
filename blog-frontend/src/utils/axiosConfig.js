import axios from 'axios';

const baseURL = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Required for Laravel Sanctum to work with CSRF
});

// Improved function to get CSRF token
const getCsrfToken = async () => {
  try {
    // Use axios directly to avoid circular dependency
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, { 
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });
    console.log('CSRF token fetched successfully');
    return true;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return false;
  }
};

// Add a request interceptor to include the CSRF token and Bearer token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get CSRF token from cookie
    let token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
      
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    } else {
      // If no token found, fetch it
      const success = await getCsrfToken();
      
      // Only try to get the token again if fetching was successful
      if (success) {
        const newToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
          
        if (newToken) {
          config.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
        }
      }
    }

    // Attach authentication token if available
    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // Don't retry if this is already a retry to prevent infinite loops
    const isRetry = config._isRetry;

    if (response && !isRetry) {
      if (response.status === 401) {
        console.warn('Unauthorized: Logging out user...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (response.status === 419) {
        console.warn('CSRF token mismatch: Refreshing token...');
        
        // Clear the existing token cookie to force a fresh one
        document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        // Get a fresh token
        const success = await getCsrfToken();
        
        if (success) {
          // Mark this request as a retry
          config._isRetry = true;
          
          // Get the new token
          const newToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
            
          if (newToken) {
            // Update the request headers with the new token
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
          }
          
          // Retry the original request with the updated token
          return axiosInstance(config);
        }
      } else if (response.status === 403) {
        console.warn('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;