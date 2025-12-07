import axios from 'axios';

// Create a custom instance
const api = axios.create({
  baseURL: 'http://localhost:8080', // Set your backend URL here
  withCredentials: true,             // <--- THIS IS THE MAGIC LINE
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;