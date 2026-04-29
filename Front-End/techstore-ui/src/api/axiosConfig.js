import axios from 'axios';

const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL.replace(/\/$/, ""), // Enlève le slash final
    headers: { 'Content-Type': 'application/json' }
});

baseApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('techstore_token');
        if (token && token.length > 20) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default baseApi; // Export simple et propre