import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Interceptor para adicionar o token a todas as requisições e verificar expiração
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token expirado, redirecionar para login
        localStorage.removeItem("token");
        window.location.href = "/login"; // ou utilize o react-router para redirecionar
        return Promise.reject(new Error("Token expirado"));
      }

      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
