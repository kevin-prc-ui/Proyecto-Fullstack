import React, { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { checkOrCreateUser } from "../../services/UsuarioService";
import { callMsGraph } from "../../graph";

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  
  return (
    <>
      <div className="">{isAuthenticated ? <Logout /> : <Login />}</div>
    </>
  );
};

const Login = () => {
  const { instance } = useMsal();
  const [graphData, setGraphData] = useState(null);


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

      const login = {
        email: graphResponse.userPrincipalName,
        password: graphResponse.id, // in real app hash the password
      };

      console.log(userData);
      console.log(login);
      await checkOrCreateUser(userData);
      // const respuesta = await login(login);

      // const token = respuesta.data.token; // Assuming your backend returns the token like this
      // localStorage.setItem("authToken", token); // Store the token
      // window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Error de autenticación: ${error.message}`);
    }
  };
  return (
    <>
      <div className="flex">
        <Button variant="primary" onClick={() => handleLogin()}>
          Iniciar sesion
        </Button>
      </div>
    </>
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
    <>
      <div className="flex">
        <Button variant="secondary" onClick={() => handleLogout()}>
          Cerrar sesion
        </Button>
      </div>
    </>
  );
};

export default MyButton;
