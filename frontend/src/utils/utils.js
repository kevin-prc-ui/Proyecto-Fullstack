/**
 * Archivo de utilidades que contiene funciones y constantes compartidas
 */

import { listRol } from "../services/RolService";

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
        return "Agente";
    default:
        return "Desconocido";
    }
};
  
  /**
   * Constantes que contiene todos los roles de la aplicacion
   */
  const fetchRoles = await listRol();
  export const USER_ROLES_ARRAY = fetchRoles.data;
  console.log(USER_ROLES_ARRAY)

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


  export const formatDate = (date) => {
    // Get the month, day, and year
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  };
  
  export function dateFormatter(dateString) {
    const inputDate = new Date(dateString);
  
    if (isNaN(inputDate)) {
      return "Invalid Date";
    }
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  
  export function getInitials(fullName) {
    const names = fullName.split(" ");
  
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  
    const initialsStr = initials.join("");
  
    return initialsStr;
  }
  
  export const PRIOTITYSTYELS = {
    alta: "text-red-600",
    media: "text-yellow-600",
    baja: "text-blue-600",
  };
  
  export const TICKET_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
  };
  
  export const BGS = [
    "bg-blue-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-green-600",
  ];
  
  