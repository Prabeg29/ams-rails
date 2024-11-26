import http from "../utils/http";

export default {
  create: (payload) => http.post("/artists/", payload),
  update: (userId: number, payload) => http.put(`/artists/${userId}`, payload),
  delete: (userId: number) => http.delete(`/artists/${userId}`)
};
