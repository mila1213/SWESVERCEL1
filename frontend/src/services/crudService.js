import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Función auxiliar interna para obtener las cabeceras con el token
const getAuthHeaders = () => {
  // Jalamos el token del almacenamiento local
  const token = localStorage.getItem('token'); 
  
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  };
};

export const getAll = async (resource) => {
  const res = await axios.get(`${BACKEND}/${resource}`);
  return res.data;
};

export const getById = async (resource, id) => {
  const res = await axios.get(`${BACKEND}/${resource}/${id}`);
  return res.data;
};

export const getByUserId = async (resource, userId) => {
  const token = localStorage.getItem("token"); 

  const res = await axios.get(`${BACKEND}/${resource}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}` // <-- ¡Este es tu pase de seguridad de Postman!
    }
  });
  
  return res.data;
};

export const createResource = async (resource, data) => {
  // Añadimos las cabeceras como tercer parámetro
  const res = await axios.post(`${BACKEND}/${resource}`, data, getAuthHeaders());
  console.log(`Respuesta del servidor al CREAR ${resource}:`, res.data);
  return res.data;
};

export const updateResource = async (resource, id, data) => {
  // Añadimos las cabeceras como tercer parámetro
  const res = await axios.put(`${BACKEND}/${resource}/${id}`, data, getAuthHeaders());
  console.log(`Respuesta del servidor al EDITAR ${resource}:`, res.data);
  return res.data;
};

export const deleteResource = async (resource, id) => {
  // Añadimos las cabeceras como segundo parámetro en el DELETE
  const res = await axios.delete(`${BACKEND}/${resource}/${id}`, getAuthHeaders());
  return res.data;
};

export default { 
  getAll, 
  getById, 
  getByUserId, 
  createResource, 
  updateResource, 
  deleteResource 
};