import { toast } from "sonner";
import { login } from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";
import { loginRequest } from "../../services/authConfig";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

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

    // 4. Manejar éxito
    sessionStorage.setItem("authToken", JSON.stringify(respuesta.data));
    toast.success("Sesión iniciada correctamente");
    navigate("/dashboard");
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
