import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Generic CRUD helpers for a resource, e.g. resource = 'products'
export const getAll = async (resource) => {
  const res = await axios.get(`${BACKEND}/${resource}`);
  return res.data;
};

export const getById = async (resource, id) => {
  const res = await axios.get(`${BACKEND}/${resource}/${id}`);
  return res.data;
};

export const createResource = async (resource, data) => {
  const res = await axios.post(`${BACKEND}/${resource}`, data);
  return res.data;
};

export const updateResource = async (resource, id, data) => {
  const res = await axios.put(`${BACKEND}/${resource}/${id}`, data);
  return res.data;
};

export const deleteResource = async (resource, id) => {
  const res = await axios.delete(`${BACKEND}/${resource}/${id}`);
  return res.data;
};

export default { getAll, getById, createResource, updateResource, deleteResource };
