import api from "./api";

export const getAllFarmers = () => api.get("/admin/farmers");
export const getFarmerById = (id) => api.get(`/admin/farmers/${id}`);
export const deleteFarmer = (id) => api.delete(`/admin/farmers/${id}`);
export const verifyFarmer = (id) => api.put(`/admin/farmers/${id}/verify`);
export const rejectFarmer = (id, reason) => api.put(`/admin/farmers/${id}/reject`, { reason });

export const getAllCentres = () => api.get("/admin/centres");
export const createCentre = (data) => api.post("/admin/centres", data);
export const updateCentre = (id, data) => api.put(`/admin/centres/${id}`, data);
export const deleteCentre = (id) => api.delete(`/admin/centres/${id}`);

export const getReports = () => api.get("/admin/reports");
export const getDashboardSummary = () => api.get("/admin/dashboard-summary");

export const getAllComplaints = () => api.get("/admin/complaints");
export const replyComplaint = (id, adminReply) => api.put(`/admin/complaints/${id}`, { adminReply });

export const getEligibleFarmers = () => api.get("/admin/eligible-farmers");

export const getAllBookingsAdmin = (params) => api.get("/admin/bookings", { params });
export const updateBookingAdmin = (id, data) => api.put(`/admin/bookings/${id}`, data);
export const cancelBookingAdmin = (id) => api.put(`/admin/bookings/${id}/cancel`);

export const getAllPaymentsAdmin = (params) => api.get("/admin/payments", { params });
export const updatePaymentAdmin = (id, data) => api.put(`/admin/payments/${id}`, data);

export const changeAdminPassword = (data) => api.put("/admin/change-password", data);