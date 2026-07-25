import axios from "axios";
import { useAuthStore } from "../store/authStore";

// En desarrollo, Vite hace proxy de /api al backend local (ver vite.config.js).
// En producción (Vercel), define VITE_API_URL con la URL pública de tu backend
// (el backend NO puede vivir en Vercel: usa un VPS/Railway/Render, ya que
// necesita procesos persistentes, WebSockets y sistema de archivos real).
const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
