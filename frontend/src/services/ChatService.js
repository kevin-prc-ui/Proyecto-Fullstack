import axios from "axios";
import { toast } from "sonner";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url

// Helper function to get the token from localStorage
const token = () => localStorage.getItem("authToken");
const getAuthToken = () => JSON.parse(token()).accessToken;

// Function to create headers with the Authorization token
const getHeaders = () => ({  
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
  
});

export const listMessages = (ticketId) =>
    axios
      .get(`${REST_API_BASE_URL}/tickets/${ticketId}/chat/messages`, getHeaders()) // Add headers to the request
      .then((response) => response)
      .catch((error) => {
        if (!error.response) {
          toast.error("Error de conexión con el servidor");
          throw new Error("Error de conexion con el servidor");
        }
        throw error;
      });