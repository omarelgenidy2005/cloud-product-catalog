import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export async function getProducts() {
  const res = await axios.get(`${API_BASE_URL}/products`);
  return res.data.data;
}

export async function getProduct(id) {
  const res = await axios.get(`${API_BASE_URL}/products/${id}`);
  return res.data.data;
}

export async function createProduct(formData) {
  const res = await axios.post(`${API_BASE_URL}/products`, formData);
  return res.data.data;
}

export async function updateProduct(id, formData) {
  const res = await axios.patch(`${API_BASE_URL}/products/${id}`, formData);
  return res.data.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`${API_BASE_URL}/products/${id}`);
  return res.data;
}