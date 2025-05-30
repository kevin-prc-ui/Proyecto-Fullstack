import { toast } from "sonner";
import { login, logout, postIp } from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";
import { loginRequest } from "../../services/authConfig";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";

export const UseLoginHandler = () => {
  const [ip, setIp] = useState(null);
  const navigate = useNavigate();
  const { instance } = useMsal();
  async function getIP() {
      const response = await fetch('https://api.ipify.org/?format=json');
      const data = await response.json();
      return response.status === 200 ? data : "err";
      
      }
      getIP().then(data => setIp(data));
      
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
    
    //4. Postear Ip en backend
    postIp(ip);
    
    // 5. Manejar éxito
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
      logout();
      localStorage.clear();
      toast.info("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
    }
  };

  return { handleLogout };
};
