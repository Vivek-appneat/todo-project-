import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.15:3000', // Set your API base URL here
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;