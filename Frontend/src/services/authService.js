import api from "./api";

export const registerFarmer = (data) => api.post("/auth/farmer/register", data);
export const loginFarmer = (data) => api.post("/auth/farmer/login", data);

export const registerAdmin = (data) => api.post("/auth/admin/register", data);
export const loginAdmin = (data) => api.post("/auth/admin/login", data);

export const registerOfficer = (data) => api.post("/auth/officer/register", data);
export const loginOfficer = (data) => api.post("/auth/officer/login", data);