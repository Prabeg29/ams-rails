import http from "../utils/http";

export default {
  create: (userId: number, payload) => http.post(`/artists/${userId}/songs`, payload),
  update: (userId: number, songId: number, payload) => http.put(`/artists/${userId}/songs/${songId}`, payload),
  delete: (userId: number, songId: number) => http.delete(`/artists/${userId}/songs/${songId}`)
};
