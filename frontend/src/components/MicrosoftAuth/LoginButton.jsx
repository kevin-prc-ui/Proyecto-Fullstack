import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  return(
    <>
      <div className="">
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
        <Button variant="secondary" onClick={() => handleLogout()}>
          Cerrar sesion
        </Button>
      </div>
    </>
  );
};

export default MyButton;