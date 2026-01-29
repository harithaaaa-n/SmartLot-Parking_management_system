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
        // Handle "Network Error" specifically (CORS or Server Down)
        if (error.message === "Network Error" && !error.response) {
            error.message = `Network Error full info: Target: ${API_BASE_URL}`;
        } else {
            const message = error.response?.data?.message || error.message || "An unexpected error occurred";
            error.message = message;
        }

        return Promise.reject(error);
    }
);

export default client;
