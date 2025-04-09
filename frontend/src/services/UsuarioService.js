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

export const listUsers = () =>
  axios
    .get(`${REST_API_BASE_URL}/users`, getHeaders()) // Add headers to the request
    .then((response) => response)
    .catch((error) => {
      if (!error.response) {
        toast.error("Error de conexión con el servidor");
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

export const signUp = (userData) => axios.post(`${REST_API_BASE_URL}/auth/signup`, userData);

export const getUserById = (userId) => axios.get(`${REST_API_BASE_URL}/users/${userId}`, getHeaders());

export const updateUser = (userId,user) => axios.put(`${REST_API_BASE_URL}/users/edit/${userId}`, user, getHeaders());

export const deleteUser = (userId) => axios.delete(`${REST_API_BASE_URL}/users/delete/${userId}`, getHeaders());

export const getUserPermissions = async () => {
  const response = await axios.get(`${REST_API_BASE_URL}/users/permisos`, getHeaders());
  return response;
};

export const checkOrCreateUser = (userData) => 
  axios.post(`${REST_API_BASE_URL}/users/check-or-create`, userData, getHeaders());

export const login = (loginData) => axios.post(`${REST_API_BASE_URL}/auth/login`, loginData);
export const logout = (signoutData) => axios.post(`${REST_API_BASE_URL}/auth/logout`, signoutData);
export const getUserRoles = (email) => {
  return axios.get(`${REST_API_BASE_URL}/users/email?email=${email}`, getHeaders())
  .then(response => response)
  .catch(error => {
    if (!error.response) {
      toast.error("Error de conexión con el servidor");
      throw new Error("Error de conexion con el servidor");
    }
    throw error;
  });
};


