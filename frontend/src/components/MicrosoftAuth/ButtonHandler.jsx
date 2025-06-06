import { toast } from "sonner";
import {
  getUserRoles,
  login,
  logout,
} from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";
import { loginRequest } from "../../services/authConfig";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { postIp } from "../../services/IpService";

export const UseLoginHandler = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleLogin = async () => {
    // 1. Autenticación con Microsoft
    const response = await instance.loginPopup(loginRequest);
    const graphResponse = await callMsGraph(response.accessToken);

    // 2. Preparar datos para el backend
    const loginData = {
      email: graphResponse.userPrincipalName,
      password: graphResponse.id,
    };

    // 3. Login en tu backend
    const respuesta = await login(loginData);
    localStorage.setItem("authToken", JSON.stringify(respuesta.data));
    const roles = await getUserRoles();
    
    // 4. Postear Ip en backend
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    const data = await ipResponse.json();
    postIp(data);
    // 5. Manejar éxito
    toast.success("Sesión iniciada correctamente");
    
    const userRoles = roles.data || [];
    
    if (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_AGENT")) {
      navigate("/helpdesk/tasks");
    }
    else if (userRoles.includes("ROLE_USER")) {
      navigate("/knowledge/home");
    }
    else {
      navigate("/dashboard");
    }
  };

  return { handleLogin };
};

export const UseLogoutHandler = () => {
  const { instance } = useMsal();
  const handleLogout = () => {
    try {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
      localStorage.clear();
      toast.info("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
    }
  };

  return { handleLogout };
};
