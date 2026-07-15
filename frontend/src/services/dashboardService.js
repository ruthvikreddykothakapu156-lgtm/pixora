import api from "./api";

export const getPhotographerDashboard = () => {
  return api.get("/dashboard/photographer");
};

export const getAdminDashboard = () => {
  return api.get("/dashboard/admin");
};