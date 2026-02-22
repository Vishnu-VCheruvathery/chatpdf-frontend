// interceptors.ts
import api from "./instance";
import { store } from "../redux/store";
import { loginSuccess, logout } from "../redux/features/authSlice";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/users/refresh");
        const newToken = res.data.accessToken;

        store.dispatch(loginSuccess(newToken));

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        store.dispatch(logout());
      }
    }

    return Promise.reject(err);
  }
);
