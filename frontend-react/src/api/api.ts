import axios from "axios";
import { useAuthStore } from "@/store/authStore.ts";

const BASE_URL = '/api'

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response, // Return successful responses as is
    (error) => {
        // If the error is 401 (Unauthorized)
        if (error.response?.status === 401) {
            // Force logout directly from the store
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;