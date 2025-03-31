import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { getUserRoles } from "../services/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const [authState, setAuthState] = useState({
    loading: true,
    roles: [],
  });

  useEffect(() => {
    const loadRoles = async () => {
      if (isAuthenticated) {
        const roles = await getUserRoles();
        setAuthState({ loading: false, roles });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadRoles();
  }, [isAuthenticated]);

  if (authState.loading) {
    return <div className="loader">.</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles.some((role) =>
    authState.roles.includes(role)
  );
  console.log("Roles del usuario:", authState.roles);
  console.log("Roles requeridos:", allowedRoles);
  console.log("Usuario autenticado:", isAuthenticated);

  return hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/notfound" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;