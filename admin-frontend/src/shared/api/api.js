import { Http } from "./Http";

export const loginAdmin = (data) => Http.post(`/login/admin`, data);
export const getDashboard = (config) => Http.get("/dashboard", config);

export const getCategories = (config) => Http.get("/categories", config);
export const createCategory = (data) => Http.post("/categories", data);
export const updateCategory = (id, data) => Http.put(`/categories/${id}`, data);
export const deleteCategory = (id) => Http.delete(`/categories/${id}`);

export const getProducts = (config) => Http.get("/products", config);
export const getProductByCategory = (id) => Http.get(`/categories/${id}`);
export const createProduct = (data) => Http.post("/products", data);
export const updateProduct = (id, data) => Http.put(`/products/${id}`, data);
export const deleteProduct = (id) => Http.delete(`/products/${id}`);

export const getUsers = (config) => Http.get("/users", config);
export const setBanStatus = (id, data) => Http.put(`/users/${id}/ban`, data);

export const getOrders = (config) => Http.get("/orders", config);

export const getProfile = () => Http.get("/profile");

