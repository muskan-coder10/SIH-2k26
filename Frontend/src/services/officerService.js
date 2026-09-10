import api from "./api";

export const getPendingBookings = () => api.get("/officer/verification");
export const verifyBooking = (bookingId) => api.put(`/officer/verification/${bookingId}`);

export const getAllBookings = () => api.get("/officer/procurement");
export const updateProcurement = (bookingId, data) => api.put(`/officer/procurement/${bookingId}`, data);

export const createOrUpdatePayment = (data) => api.post("/officer/payment", data);

export const getOfficerDashboardSummary = () => api.get("/officer/dashboard-summary");
export const getOfficerFarmers = () => api.get("/officer/farmers");
export const getOfficerReports = () => api.get("/officer/reports");
export const changeOfficerPassword = (data) => api.put("/officer/change-password", data);