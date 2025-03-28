import axios from "axios";
import { toast } from "sonner";

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

export const listUsers = () =>
  axios
    .get(REST_API_BASE_URL+"")
    .then((response) => response)
    .catch((error) => {
      if (!error.response) {
        toast.error("Error de conexión con el servidor");
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

export const createUser = (user) => axios.post(REST_API_BASE_URL, user);

export const getUserById = (userId) => axios.get(REST_API_BASE_URL +'/'+userId);

export const updateUser = (userId,user) => axios.put(REST_API_BASE_URL+"/edit/"+userId, user);

export const deleteUser = (userId) => axios.delete(REST_API_BASE_URL +'/delete/'+userId);