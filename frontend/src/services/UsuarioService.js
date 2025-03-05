import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/users";

export const listUsers = () =>
  axios
    .get(REST_API_BASE_URL+"")
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

export const createUser = (user) => axios.post(REST_API_BASE_URL, user);

export const getUserById = (userId) => axios.get(REST_API_BASE_URL +'/'+userId);

export const updateUser = (userId,user) => axios.put(REST_API_BASE_URL+"/edit/"+userId, user);

export const deleteUser = (userId) => axios.delete(REST_API_BASE_URL +'/delete/'+userId);
export const getUserPermissions = async () => {
  const token = localStorage.getItem("authToken"); //if you are using token
  const response = await axios.get(`${REST_API_BASE_URL}/users/permissions`,{
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  return response;
};