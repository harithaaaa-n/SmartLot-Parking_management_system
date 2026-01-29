// src/lib/app.ts

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return response.json();
};
