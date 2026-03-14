import { api } from "./axiosInstance";

export const myListService = {
  getAll: async () => (await api.get("/myList")).data,

  add: async (payload) => (await api.post("/myList", payload)).data,

  update: async (id, payload) => (await api.patch(`/myList/${id}`, payload)).data,

  remove: async (id) => (await api.delete(`/myList/${id}`)).data,
  
};