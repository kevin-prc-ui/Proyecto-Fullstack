import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api";

export const listUsuarios = () =>
  axios
    .get(REST_API_BASE_URL+"/usuarios")
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });

export const listRol = () =>
  axios
    .get(REST_API_BASE_URL+"/roles")
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });
