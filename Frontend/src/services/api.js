import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically to every request if user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("anndisha_user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;