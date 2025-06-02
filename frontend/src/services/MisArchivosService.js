import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api";

// Obtener token del localStorage
const token = () => localStorage.getItem("authToken");

const getAuthToken = () => {
  const storedToken = token();
  try {
    return storedToken ? JSON.parse(storedToken)?.accessToken : null;
  } catch (e) {
    console.error("Error parsing auth token:", e);
    return null;
  }
};

const getHeaders = () => {
  const accessToken = getAuthToken();
  return accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
};

// === Endpoints ===
export const getArchivoUrl = (id) =>
  `${REST_API_BASE_URL}/archivos/download/${id}`;

export const getMisArchivos = () =>
  axios.get(`${REST_API_BASE_URL}/mis-archivos/`, getHeaders());

export const getMisArchivosById = (id) =>
  axios.get(`${REST_API_BASE_URL}/mis-archivos/${id}`, getHeaders());

export const createMisArchivo = (archivoDto) =>
  axios.post(`${REST_API_BASE_URL}/mis-archivos/save`, archivoDto, getHeaders());

export const createCarpeta = (carpetaDto) =>
  axios.post(`${REST_API_BASE_URL}/carpetas`, carpetaDto, getHeaders());

export const getAllCarpetas = () =>
  axios.get(`${REST_API_BASE_URL}/carpetas`, getHeaders());

// ✅ Nuevo método para subir archivos binarios
export const uploadArchivo = (file, carpetaId) => {
  const formData = new FormData();
  formData.append("archivo", file);
  if (carpetaId) {
    formData.append("carpetaId", carpetaId);
  }

  
  return axios.post(`${REST_API_BASE_URL}/archivos/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
};
