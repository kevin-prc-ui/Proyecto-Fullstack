/**
 * Archivo de utilidades que contiene funciones y constantes compartidas
 */

/**
 * Formatea el rol del usuario para mostrar un nombre legible.
 * @param {string} rolId - ID del rol del usuario.
 * @returns {string} Nombre del rol.
 */
export const formatUserRole = (rolId) => {
    switch (rolId) {
    case 1:
        return "Administrador";
    case 2:
        return "Staff";
    default:
        return "Desconocido";
    }
};

  
  /**
   * Constantes que contiene todos los roles de la aplicacion
   */
  export const USER_ROLES_ARRAY = [
    { id: "1", name: "Administrador" },
    { id: "2", name: "Staff" },
  ];
  
  /**
   * Mensaje de error por defecto
   */
  export const DEFAULT_ERROR_MESSAGE = "Error de conexión con el servidor. Intente nuevamente más tarde.";
  
  /**
   * Funcion que se encarga de manejar los errores de la API.
   * @param {*} error - El error que se produjo en la api
   * @param {string} defaultMessage - El mensaje que debe mostrar si el error no viene especificado.
   */
  export const handleApiError = (error, defaultMessage = "An error occurred") => {
    console.error("API error:", error);
    if (error.response && error.response.data) {
      // Show the error from the backend if available
      alert(`${defaultMessage}: ${error.response.data.message || ""}`);
    } else {
      alert(defaultMessage);
    }
  };
  