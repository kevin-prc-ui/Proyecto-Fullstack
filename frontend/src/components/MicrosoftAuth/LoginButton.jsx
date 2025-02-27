import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  return(
    <>
      <div className="navbar-collapse justify-content-end">
          {isAuthenticated ? <Logout /> : <Login />}
        </div>
    </>
  )
} 

const Login = () => {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };
  return (
    <Button variant="secondary" onClick={() => handleLogin()}>
      Iniciar sesion
      {/* // <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>Sign in using Popup</Dropdown.Item> */}
    </Button>
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
        <div className="px-md-5">
          <div className="px-md-5">Bienvenido</div>
        </div>
        <Button variant="secondary" onClick={() => handleLogout()}>
          Cerrar sesion
          {/* // <Dropdown.Item as="button" onClick={() => handleLogout("popup")}>Sign in using Popup</Dropdown.Item> */}
        </Button>
      </div>
    </>
  );
};

export default MyButton;