import React, { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { checkOrCreateUser } from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";
import { login } from "../../services/UsuarioService";
const getAuthToken = () => sessionStorage.getItem("authToken");

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  return <div>{isAuthenticated ? <Logout /> : <Login />}</div>;
};

const Login = () => {
  const { instance } = useMsal();
  const [graphData, setGraphData] = useState(null);

  // login handler
  const handleLogin = async () => {
    try {
      // 1. Inicio del login
      const response = await instance.loginPopup(loginRequest);

      // 2. Se obtienen los datos del usuario una vez se hace el login
      const graphResponse = await callMsGraph(response.accessToken);
      setGraphData(graphResponse);

      // 3. Se crea el usuario y se comprueba si existe o no en la base de datos
      const userData = {
        nombre: graphResponse.givenName,
        apellido: graphResponse.surname,
        email: graphResponse.userPrincipalName,
        enabled: true,
        rolId: 2,
        permisos: ["CREAR_TICKET"],
      };

      const loginData = {
        email: graphResponse.userPrincipalName,
        password: '1', // in real app hash the password
      };

      const respuesta = await login(loginData);
      const token = respuesta.data; // Assuming your backend returns the token like this
      console.log(token);
      localStorage.setItem("authToken", token); // Store the token
      console.log(getAuthToken());
      
      await checkOrCreateUser(userData);

      // window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Error de autenticación: ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <Button variant="primary" onClick={handleLogin}>
        Iniciar sesión
      </Button>
    </div>
  );
};

const Logout = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });
  };

  return (
    <div className="flex">
      <Button variant="secondary" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
};

export default MyButton;
