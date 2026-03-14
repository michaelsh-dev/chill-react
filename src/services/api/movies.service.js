import { api } from "./axiosInstance";

export const moviesService = {
  getAll: async () => {
    const res = await api.get("/movies");
    return res.data;
  },
};