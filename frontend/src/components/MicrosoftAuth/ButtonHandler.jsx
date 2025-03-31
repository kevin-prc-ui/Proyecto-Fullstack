import React from "react";
import { toast } from "sonner";
import { login } from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";
import { loginRequest } from "../../services/authConfig";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

export const UseLoginHandler = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const graphResponse = await callMsGraph(response.accessToken);
      
      const loginData = {
        email: graphResponse.userPrincipalName,
        password: graphResponse.id,
      };

      const respuesta = await login(loginData);
      sessionStorage.setItem("authToken", JSON.stringify(respuesta.data));
      
      navigate("/dashboard");
      toast.success("Sesión iniciada correctamente");
    } catch (error) {
      toast.error(`Error de autenticación: ${error.message}`);
      console.error("Login failed:", error);
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
      sessionStorage.removeItem("authToken");
      toast.info("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
    }
  };

  return { handleLogout };
};