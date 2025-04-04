// services/auth.js
export const getAuthToken = () => {
    return JSON.parse(localStorage.getItem("authToken"));
  };
  
  export const getUserRolesByDecryptedToken = () => {
    const token = getAuthToken()?.roles;
    if (!token) return [];
    
    try {
      return token?.map(role => role.nombre) || [];
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
  };