import api from "./api";

export const bookToken = (data) => api.post("/farmer/token", data);
export const getMyToken = () => api.get("/farmer/token");
export const getMySchedule = () => api.get("/farmer/schedule");
export const getCropStatus = (bookingId) => api.get(`/farmer/crop-status/${bookingId}`);
export const getMyPayments = () => api.get("/farmer/payment");

export const submitComplaint = (data) => api.post("/farmer/complaints", data);
export const getMyComplaints = () => api.get("/farmer/complaints");