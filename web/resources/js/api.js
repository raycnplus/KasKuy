import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = localStorage.getItem("token");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
