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
// ✅ Esta línea es correcta
export const getArchivoUrl = (id) => `${REST_API_BASE_URL}/archivos/ver/${id}`;

export const getMisArchivos = () =>
  axios.get(`${REST_API_BASE_URL}/mis-archivos/`, getHeaders());

export const getMisArchivosById = (id) =>
  axios.get(`${REST_API_BASE_URL}/mis-archivos/${id}`, getHeaders());

export const createMisArchivo = (archivoDto) =>
  axios.post(`${REST_API_BASE_URL}/mis-archivos/save`, archivoDto, getHeaders());

export const createCarpeta = (carpetaDto, usuarioId) =>
  axios.post(`${REST_API_BASE_URL}/carpetas?usuarioId=${usuarioId}`, carpetaDto, getHeaders());


export const getAllCarpetas = () =>
  axios.get(`${REST_API_BASE_URL}/carpetas`, getHeaders());

export const getArchivosPorCarpeta = (carpetaId, usuarioId) =>
  axios.get(`${REST_API_BASE_URL}/archivos/carpeta/${carpetaId}?usuarioId=${usuarioId}`, getHeaders());

export const getArchivosSinCarpeta = (usuarioId) =>
  axios.get(`${REST_API_BASE_URL}/archivos/sin-carpeta?usuarioId=${usuarioId}`, getHeaders());

export const desactivarArchivo = (archivoId) =>
  axios.put(`${REST_API_BASE_URL}/archivos/desactivar/${archivoId}`, {}, getHeaders());

export const getUserId = () =>
  axios.get(`${REST_API_BASE_URL}/users/me/id`, getHeaders());

export const getArchivosPorSitio = (sitioId) =>
  axios.get(`${REST_API_BASE_URL}/archivos/sitio/${sitioId}`, getHeaders());


// ✅ Nuevo método para subir archivos binarios
export const uploadArchivo = (file, carpetaId, usuarioId, sitioId) => {
  const storedToken = localStorage.getItem("authToken");

  let headers = { "Content-Type": "multipart/form-data" };

  try {
    const accessToken = JSON.parse(storedToken)?.accessToken;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (e) {
    console.error("Token inválido");
  }

  const formData = new FormData();
  formData.append("archivo", file);
  if (carpetaId) formData.append("carpetaId", carpetaId);
  formData.append("usuarioId", usuarioId);
  if (sitioId) formData.append("sitioId", sitioId);

  return axios.post(`${REST_API_BASE_URL}/archivos/uploads`, formData, { headers });
};


