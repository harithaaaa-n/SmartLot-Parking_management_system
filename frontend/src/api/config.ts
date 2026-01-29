// Use environment variable for API URL (Set VITE_API_BASE_URL in Vercel)
// Robustly handle missing '/api' suffix or accidental double slashes
const envVar = import.meta.env.VITE_API_BASE_URL;
let envUrl = "";

if (envVar) {
    // Remove trailing slashes
    envUrl = envVar.replace(/\/+$/, "");
    // Append /api if not present
    if (!envUrl.endsWith("/api")) {
        envUrl += "/api";
    }
}

export const API_BASE_URL = envUrl || "http://localhost:5000/api";
