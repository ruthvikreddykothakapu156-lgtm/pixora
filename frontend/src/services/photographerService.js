import api from "./api";

export const getPhotographers = (params = {}) => {
  return api.get("/photographers", { params });
};

export const searchPhotographers = (query) => {
  return api.get("/photographers/search", { params: { q: query } });
};

export const getPhotographerById = (id) => {
  return api.get(`/photographers/${id}`);
};

export const updatePhotographer = (id, data) => {
  return api.put(`/photographers/${id}`, data);
};

export const uploadQrCode = (id, formData) => {
  return api.post(`/photographers/${id}/qr-code`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePhotographer = (id) => {
  return api.delete(`/photographers/${id}`);
};
export const uploadProfilePhoto = (id, formData) => {
  return api.post(`/photographers/${id}/profile-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadCoverPhoto = (id, formData) => {
  return api.post(`/photographers/${id}/cover-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};