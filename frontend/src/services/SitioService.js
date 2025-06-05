import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/sitios";

// Helper para manejar el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  try {
    const accessToken = token ? JSON.parse(token)?.accessToken : null;
    return accessToken 
      ? { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      : { headers: { "Content-Type": "application/json" } };
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return { headers: { "Content-Type": "application/json" } };
  }
};

// Configuración global de axios
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Manejar token expirado o no válido
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default {
  /**
   * Obtiene todos los sitios
   * @returns {Promise<Array<SitioDto>>}
   */
  getAll() {
    return axios.get(REST_API_BASE_URL, getAuthHeaders());
  },

  /**
   * Obtiene un sitio por ID
   * @param {number} id 
   * @returns {Promise<SitioDto>}
   */
  getById(id) {
    return axios.get(`${REST_API_BASE_URL}/${id}`, getAuthHeaders());
  },

  /**
   * Crea un nuevo sitio
   * @param {SitioDto} sitioData 
   * @returns {Promise<SitioDto>}
   */
  create(sitioData) {
    // Transformar datos si es necesario para el backend
    const payload = {
      ...sitioData,
      usuariosAsignados: sitioData.usuariosAsignados?.map(u => ({ id: u.id })) || []
    };
    
    return axios.post(REST_API_BASE_URL, payload, getAuthHeaders());
  },

  /**
   * Actualiza un sitio existente
   * @param {number} id 
   * @param {SitioDto} sitioData 
   * @returns {Promise<SitioDto>}
   */
  update(id, sitioData) {
    return axios.put(`${REST_API_BASE_URL}/${id}`, sitioData, getAuthHeaders());
  },

  /**
   * Elimina un sitio
   * @param {number} id 
   * @returns {Promise<void>}
   */
  delete(id) {
    return axios.delete(`${REST_API_BASE_URL}/${id}`, getAuthHeaders());
  },

  /**
   * Obtiene sitios por usuario
   * @param {number} userId 
   * @returns {Promise<Array<SitioDto>>}
   */
  getByUser(userId) {
    return axios.get(`${REST_API_BASE_URL}/user/${userId}`, getAuthHeaders());
  }
};