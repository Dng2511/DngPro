
import axios from "axios";
import { BASE_API } from "../shared/constants/app";

export const Http = axios.create({
    baseURL: BASE_API,
})

Http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});