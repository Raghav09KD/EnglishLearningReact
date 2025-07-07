import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NODE_ENV, // ✅ update if your base path changes
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor for tokens
instance.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem("token"); // or use context/state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add global error interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;