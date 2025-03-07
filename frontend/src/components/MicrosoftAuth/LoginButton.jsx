import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { checkOrCreateUser } from "../../services/UsuarioService";

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

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const account = response.account;
      
      // Validación adicional para cuentas empresariales
      if (!account.idTokenClaims?.preferred_username) {
        throw new Error("Esta cuenta no está autorizada");
      }
  
      const [nombre, ...apellidoParts] = account.name.split(' ');
      const apellido = apellidoParts.join(' ') || 'Sin apellido';
  
      const userData = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: account.username.toLowerCase(),
        enabled: true,
        rolId: 2,
        permisos: ["CREAR_TICKET"]
      };

      console.log(userData);
      await checkOrCreateUser(userData);
      window.location.reload(); // Forzar actualización del estado de autenticación
      
    } catch (error) {
      console.error("Error completo:", error);
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
