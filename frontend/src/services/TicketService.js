import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url

// Helper function to get the token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Function to create headers with the Authorization token
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});
export const listTickets = () =>
    axios
      .get(REST_API_BASE_URL+"/tickets", getHeaders())
      .then((response) => response)
      .catch((error) => {
        // Detectamos específicamente errores de conexión
        if (!error.response) {
          throw new Error("Error de conexion con el servidor");
        }
        throw error;
      });

export const deleteTicket = (ticketId) => axios.delete(`${REST_API_BASE_URL}/tickets/${ticketId}`, getHeaders());

