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

// Response Interceptor
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("Token expired or unauthorized. Logging out.");

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Optional: Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
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