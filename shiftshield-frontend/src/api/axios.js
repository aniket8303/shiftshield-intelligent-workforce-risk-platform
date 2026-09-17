import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Memory cache for static reference data
const cache = new Map();
const CACHEABLE_ENDPOINTS = ['/departments', '/organizations'];

const originalGet = api.get;
api.get = async (url, config = {}) => {
  // Check if we should cache this request
  const isCacheable = CACHEABLE_ENDPOINTS.some(endpoint => url.startsWith(endpoint) && !url.includes('?'));
  
  if (isCacheable) {
    const cacheKey = url;
    
    // If we have a cached response, return it immediately (wrapped in a resolved promise like Axios)
    if (cache.has(cacheKey)) {
      return Promise.resolve(cache.get(cacheKey));
    }
    
    // If there is a pending request for this URL, wait for it instead of firing a new one
    if (api._pendingRequests && api._pendingRequests.has(cacheKey)) {
      return api._pendingRequests.get(cacheKey);
    }
    
    // Initialize pending requests map if it doesn't exist
    if (!api._pendingRequests) {
      api._pendingRequests = new Map();
    }
    
    // Make the actual network request
    const requestPromise = originalGet.call(api, url, config).then(response => {
      // Store successful response in cache
      cache.set(cacheKey, response);
      api._pendingRequests.delete(cacheKey);
      return response;
    }).catch(error => {
      api._pendingRequests.delete(cacheKey);
      throw error;
    });
    
    api._pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }
  
  // For all other requests, proceed normally
  return originalGet.call(api, url, config);
};

export default api;