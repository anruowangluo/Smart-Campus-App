import axios from 'axios';

const request = axios.create({
  baseURL: '/dev-api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add Token
request.interceptors.request.use(
  (config) => {
    // Retrieve token from storage
    const token = localStorage.getItem('smart_campus_token');
    
    // If token exists, append it to the Authorization header
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle Errors & Data extraction
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // Handle Binary data (blobs)
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
        return res;
    }

    // Standard API response handling
    // Code 401: Unauthorized / Token Expired
    if (res.code === 401) {
       localStorage.removeItem('smart_campus_token');
       // Optionally redirect to login or reject to let UI handle it
       return Promise.reject(new Error('会话已过期，请重新登录'));
    }
    
    // Handle business logic errors (non-200 codes)
    if (res.code !== 200 && res.code !== undefined) {
        return Promise.reject(new Error(res.msg || 'Error'));
    }

    return res;
  },
  (error) => {
    console.warn('Request Failed:', error.message);
    // Handle HTTP 401 status from server
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('smart_campus_token');
    }
    return Promise.reject(error);
  }
);

export default request;