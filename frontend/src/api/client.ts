import axios from 'axios';
import { API_BASE_URL } from './config';

// Create a centralized Axios instance
const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a response interceptor to handle errors globally if needed
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle global errors here (e.g., 401 Unauthorized)
        // For now, we just reject the promise so the caller can handle it
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        // Attach the formatted message to the error object for easier access
        error.message = message;
        return Promise.reject(error);
    }
);

export default client;
