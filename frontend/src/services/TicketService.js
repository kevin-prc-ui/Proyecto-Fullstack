import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url

// Helper function to get the token from sessionStorage
const token = () => sessionStorage.getItem("authToken");
const getAuthToken = () => JSON.parse(token()).accessToken;
// Function to create headers with the Authorization token
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const listTickets = (id) =>
    axios
      .get(REST_API_BASE_URL+`/tickets?page=${id}&size=8`, getHeaders())
      .then((response) => response)
      .catch((error) => {
        // Detectamos específicamente errores de conexión
        if (!error.response) {
          throw new Error("Error de conexion con el servidor");
        }
        throw error;
      });

export const deleteTicket = (ticketId) => axios.delete(`${REST_API_BASE_URL}/tickets/${ticketId}`, getHeaders());

