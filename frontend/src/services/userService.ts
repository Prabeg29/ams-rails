import http from "../utils/http";

export default {
  create: (payload) => http.post("/users/", payload),
  update: (userId, payload) => http.put(`/users/${userId}`, payload),
  delete: (userId: number) => http.delete(`/users/${userId}`)
};
