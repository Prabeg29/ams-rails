import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3002/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await http.post("auth/generate-access-token", { }, { withCredentials: true });

        console.log(response)

        return http(originalRequest); 
      } catch (error) {
        localStorage.removeItem("user");
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error);
  }
);

export default http;
