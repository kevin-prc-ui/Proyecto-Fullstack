import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/users";

export const listUsuarios = () =>
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

    export const createUsuario = (usuario) =>
      axios
        .post(REST_API_BASE_URL, usuario)
        .then((response) => response)
        .catch((error) => {
          // Detectamos específicamente errores de conexión
          if (!error.response) {
            throw new Error("Error de conexion con el servidor");
          }
          throw error;
        });
    
