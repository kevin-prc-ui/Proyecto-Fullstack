import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { useEffect, useState } from "react";
import {getUserRoles} from "../services/auth"

// Nuevo componente ProtectedRoute con control de roles
const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  
  // Función para obtener roles del token

  useEffect(() => {
    if (isAuthenticated) {
      setUserRoles(getUserRoles());
      setRolesLoaded(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (!rolesLoaded) {
    return <div className="spinner">...</div>; // Agrega un componente de carga
  }

  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

  return hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/notauthorized" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;