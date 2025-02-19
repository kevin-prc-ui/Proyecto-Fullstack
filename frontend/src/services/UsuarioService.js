import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/usuarios";

export const listUsuarios = () =>
  axios
    .get(REST_API_BASE_URL)
    .then((response) => response)
    .catch((error) => {
      // Detectamos específicamente errores de conexión
      if (!error.response) {
        throw new Error("Error de conexion con el servidor");
      }
      throw error;
    });
