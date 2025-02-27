import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/roles";

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
