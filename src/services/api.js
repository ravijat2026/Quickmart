import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Category APIs ---
export const getAllCategories = (page = 0, size = 10) => 
  api.get(`/category/categories?page=${page}&size=${size}`);

export const getCategoryById = (id) => 
  api.get(`/category/categories/${id}`);

export const searchCategories = (keyword, page = 0, size = 10) => 
  api.get(`/category/search?keyword=${keyword}&page=${page}&size=${size}`);

export const createCategory = (data) => 
  api.post('/category/admin/categories', data);

export const updateCategory = (id, data) => 
  api.patch(`/category/admin/categories/${id}`, data);

export const deleteCategory = (id) => 
  api.delete(`/category/admin/categories/${id}`);


// --- Product APIs ---
export const getAllProducts = (page = 0, size = 12) => 
  api.get(`/product/products?page=${page}&size=${size}`);

export const getProductById = (id) => 
  api.get(`/product/products/${id}`);

export const getProductsByCategory = (categoryId, page = 0, size = 12) => 
  api.get(`/product/categories/${categoryId}/products?page=${page}&size=${size}`);

export const searchProducts = (keyword, page = 0, size = 12) => 
  api.get(`/product/search?keyword=${keyword}&page=${page}&size=${size}`);

export const createProduct = (categoryId, data) => 
  api.post(`/product/admin/products?categoryId=${categoryId}`, data);

export const updateProduct = (id, data) => 
  api.patch(`/product/admin/products/${id}`, data);

export const deleteProduct = (id) => 
  api.delete(`/product/admin/products/${id}`);

export default api;