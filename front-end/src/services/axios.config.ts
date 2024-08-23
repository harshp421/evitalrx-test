import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
     console.log(response,"response");
    return response;
  },
  error => {
    // Handle response error
    if (error.response && error.response.data.message === "Your Session is expired") {
      // Clear localStorage and redirect to login page
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
      return Promise.reject(error);
  }
);

export default axiosInstance;