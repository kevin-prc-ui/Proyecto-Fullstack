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
export const getSitios = () =>
  axios.get(`${REST_API_BASE_URL}/sitios`, getHeaders());
export const getSitioById = (id) =>
  axios.get(`${REST_API_BASE_URL}/sitios/${id}`, getHeaders());
export const createSitio = (sitioDto) =>
  axios.post(`${REST_API_BASE_URL}/sitios`, sitioDto, getHeaders());
export const updateSitio = (id, sitioDto) =>
  axios.put(`${REST_API_BASE_URL}/sitios/${id}`, sitioDto, getHeaders());
export const deleteSitio = (id) =>
  axios.delete(`${REST_API_BASE_URL}/sitios/${id}`, getHeaders());
export const getSitiosByUser = (userId) =>
  axios.get(`${REST_API_BASE_URL}/sitios/user/${userId}`, getHeaders());