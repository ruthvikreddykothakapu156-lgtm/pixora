import api from "./api";

export const getAlbums = (params = {}) => {
  return api.get("/albums", { params });
};

export const getAlbumsByPhotographer = (photographerId) => {
  return api.get(`/albums/photographer/${photographerId}`);
};

export const getAlbumById = (id) => {
  return api.get(`/albums/${id}`);
};

export const createAlbum = (data) => {
  return api.post("/albums", data);
};

export const updateAlbum = (id, data) => {
  return api.put(`/albums/${id}`, data);
};

export const deleteAlbum = (id) => {
  return api.delete(`/albums/${id}`);
};