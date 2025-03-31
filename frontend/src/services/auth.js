// services/auth.js
export const getAuthToken = () => {
    return JSON.parse(sessionStorage.getItem("authToken"));
  };
  
  export const getUserRoles = () => {
    const token = getAuthToken()?.roles;
    if (!token) return [];
    
    try {
      return token?.map(role => role.nombre) || [];
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
  };