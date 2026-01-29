// Use environment variable for API URL (Set VITE_API_BASE_URL in Vercel)
// Removes trailing slash if user accidentally adds one
const envUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "") : "";
export const API_BASE_URL = envUrl || "http://localhost:5000/api";
