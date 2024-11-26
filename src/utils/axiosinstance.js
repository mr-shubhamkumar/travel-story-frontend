import axios from "axios";
import { BASE_URL } from "./constants";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept request to add token (if exists)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token"); // Get token from localStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Set Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance