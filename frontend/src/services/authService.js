import api from "./api";

export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getAllUsers = () => {
  return api.get("/auth/users");
};

export const toggleUserBan = (userId) => {
  return api.put(`/auth/users/${userId}/ban`);
};

export const updateUserRole = (userId, role) => {
  return api.put(`/auth/users/${userId}/role`, { role });
};

export const deleteUser = (userId) => {
  return api.delete(`/auth/users/${userId}`);
};