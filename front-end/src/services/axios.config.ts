import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Optionally, you can add interceptors for request and response
axiosInstance.interceptors.request.use(
  config => {
    // Modify request config before sending the request
    // For example, add an authorization token
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // Handle response data
    return response;
  },
  error => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default axiosInstance;