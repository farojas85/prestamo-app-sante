import axios from 'axios'

export const prestamoApi = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL
});

export const prestamoStorageApi = import.meta.env.VITE_APP_API_STORAGE;