import axios from 'axios';

const rawBackend = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');
const BACKEND = rawBackend.endsWith('/api') ? rawBackend : `${rawBackend}/api`;

// Función auxiliar interna para obtener las cabeceras con el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  console.log('🔐 getAuthHeaders():');
  console.log('   Token disponible:', token ? '✅ Sí' : '❌ No');
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('   Header Authorization:', 'Bearer ' + token.slice(0, 20) + '...');
  } else {
    console.warn('   ⚠️ ADVERTENCIA: No hay token en localStorage');
  }

  return { headers };
};

export const getAll = async (resource) => {
  console.log(`📥 GET /${resource}`);
  const res = await axios.get(`${BACKEND}/${resource}`, getAuthHeaders());
  return res.data;
};

export const getById = async (resource, id) => {
  console.log(`📥 GET /${resource}/${id}`);
  const res = await axios.get(`${BACKEND}/${resource}/${id}`);
  return res.data;
};

export const getByUserId = async (resource, userId) => {
  console.log(`📥 GET /${resource}/user/${userId}`);
  const authHeaders = getAuthHeaders();
  console.log('   Enviando headers:', JSON.stringify(authHeaders));
  const res = await axios.get(`${BACKEND}/${resource}/user/${userId}`, authHeaders);
  return res.data;
};

export const createResource = async (resource, data) => {
  console.log(`📝 POST /${resource}`, data);
  const res = await axios.post(`${BACKEND}/${resource}`, data, getAuthHeaders());
  console.log(`Respuesta del servidor al CREAR ${resource}:`, res.data);
  return res.data;
};

export const updateResource = async (resource, id, data) => {
  console.log(`✏️ PUT /${resource}/${id}`, data);
  const res = await axios.put(`${BACKEND}/${resource}/${id}`, data, getAuthHeaders());
  console.log(`Respuesta del servidor al EDITAR ${resource}:`, res.data);
  return res.data;
};

export const deleteResource = async (resource, id) => {
  console.log(`🗑️ DELETE /${resource}/${id}`);
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