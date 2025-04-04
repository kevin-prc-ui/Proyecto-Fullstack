import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api";

// Helper function to get the token from localStorage
const token = () => localStorage.getItem("authToken");
const getAuthToken = () => JSON.parse(token()).accessToken;
// Function to create headers with the Authorization token
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const listRol = () =>
  axios
    .get(REST_API_BASE_URL+"/roles", getHeaders())
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });
