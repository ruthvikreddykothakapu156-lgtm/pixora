import api from "./api";

export const getReviewsByPhotographer = (photographerId) => {
  return api.get(`/reviews/photographer/${photographerId}`);
};

export const createReview = (data) => {
  return api.post("/reviews", data);
};

export const getTopRatedPhotographers = (limit = 6) => {
  return api.get("/reviews/top-rated", { params: { limit } });
};

export const deleteReview = (id) => {
  return api.delete(`/reviews/${id}`);
};