import axios from "axios";
import { jwtDecode } from "jwt-decode";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(new Error("Token expirado"));
        }

        /* config.headers.Authorization = `${token}`; */
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Token inválido"));
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
