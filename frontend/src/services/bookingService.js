import api from "./api";

export const createBooking = (data) => {
  return api.post("/bookings", data);
};

export const getMyBookings = () => {
  return api.get("/bookings/my-bookings");
};

export const getBookingById = (id) => {
  return api.get(`/bookings/${id}`);
};

export const submitPaymentScreenshot = (bookingId, formData) => {
  return api.post(`/bookings/${bookingId}/payment-screenshot`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getBookingsByPhotographer = (photographerId) => {
  return api.get(`/bookings/photographer/${photographerId}`);
};

export const updateBookingStatus = (bookingId, status) => {
  return api.put(`/bookings/${bookingId}/status`, { status });
};

export const getPendingPayments = (photographerId) => {
  return api.get(`/bookings/photographer/${photographerId}/pending-payments`);
};

export const updatePaymentStatus = (bookingId, paymentStatus) => {
  return api.put(`/bookings/${bookingId}/payment-status`, { paymentStatus });
};

export const getAllBookings = () => {
  return api.get("/bookings");
};

export const deleteBooking = (id) => {
  return api.delete(`/bookings/${id}`);
};

export const getAvailability = (photographerId) => {
  return api.get(`/bookings/photographer/${photographerId}/availability`);
};