import { Http } from "./Http";
export const getProducts = (config) => Http.get("/products", config);

export const getCategories = (config) => Http.get("/categories", config);
export const getCategory = (id, config) => Http.get(`/categories/${id}`, config);

export const getProductsCategory = (id, config) => Http.get(`/categories/${id}/products`, config);
export const getProductDetails = (id, config) => Http.get(`/products/${id}`, config);
export const getCommentsProduct = (id, config) => Http.get(`/products/${id}/comments`, config)
export const postCommentsProduct = (id, data, config) => Http.post(`/products/${id}/comments`, data, config)
export const getSearchProduct = (id, config) => Http.get(`/products/?name=${id}`, config);

export const postOrder = (data, config) => Http.post("/orders", data, config);

// Auth APIs
export const postLogin = (data, role) => Http.post(`/login/${role}`, data);
export const postRegister = (data) => Http.post("/register/customer", data);

// Profile APIs
export const getProfile = (config) => Http.get("/profile", config);
export const updateEmail = (data, config) => Http.put("/profile/email", data, config);
export const updatePhone = (data, config) => Http.put("/profile/phone", data, config);
export const updatePassword = (data, config) => Http.put("/profile/password", data, config);
export const addAddress = (data, config) => Http.post("/profile/addresses", data, config);
export const updateAddress = (addressId, data, config) => Http.put(`/profile/addresses/${addressId}`, data, config);
export const deleteAddress = (addressId, config) => Http.delete(`/profile/addresses/${addressId}`, config);