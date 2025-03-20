import axios from "axios";
import { toast } from "sonner";

const REST_API_BASE_URL = "http://localhost:8080/api"; //update the base url


export const listUsers = () =>
  axios
    .get(`${REST_API_BASE_URL}/users`) // Add headers to the request
    .then((response) => response)
    .catch((error) => {
      if (!error.response) {
        toast.error("Error de conexión con el servidor");
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

export const createUser = (user) => axios.post(`${REST_API_BASE_URL}/users`, user);

export const getUserById = (userId) => axios.get(`${REST_API_BASE_URL}/users/${userId}` );

export const updateUser = (userId,user) => axios.put(`${REST_API_BASE_URL}/users/edit/${userId}`, user);

export const deleteUser = (userId) => axios.delete(`${REST_API_BASE_URL}/users/delete/${userId}`);

export const getUserPermissions = async () => {
  const response = await axios.get(`${REST_API_BASE_URL}/users/permisos`);
  return response;
};

export const checkOrCreateUser = (userData) => 
  axios.post(`${REST_API_BASE_URL}/users/check-or-create`, userData);

export const login = (loginData) => axios.post(`${REST_API_BASE_URL}/auth/login`, loginData);
export const logout = (signoutData) => axios.post(`${REST_API_BASE_URL}/auth/signout`, signoutData);
