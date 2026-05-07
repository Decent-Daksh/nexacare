<<<<<<< HEAD
import axios from "axios";
import { API_BASE_URL } from "../config/env";
=======
import axios from 'axios';
import { API_BASE_URL } from '../config/env';
>>>>>>> main

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
<<<<<<< HEAD
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nexacare_token");
=======
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nexacare_token');
>>>>>>> main
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
<<<<<<< HEAD
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("nexacare_token");
    }
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || "Something went wrong",
      raw: error,
    });
  },
=======
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('nexacare_token');
    }
    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || 'Something went wrong',
      raw: error,
    });
  }
>>>>>>> main
);

export default apiClient;
