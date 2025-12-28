import axios from "axios"
import { apiUrl } from "../utils/connect"

export const Http = axios.create({
    baseURL: apiUrl,
})

// Attach token from localStorage to Authorization header automatically
Http.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));
