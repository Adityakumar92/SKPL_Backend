import axios from "axios";
import { store } from "./redux/store";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// Optionally attach token automatically for every request
axiosInstance.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  const state = store.getState();
  // console.log(state);
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
