import api from "./api";

export const getPhotosByAlbum = (albumId) => {
  return api.get(`/photos/album/${albumId}`);
};

export const uploadPhotos = (formData) => {
  return api.post("/photos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePhoto = (photoId) => {
  return api.delete(`/photos/${photoId}`);
};