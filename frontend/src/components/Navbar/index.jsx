import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { Navbar } from 'react-bootstrap';

const Index = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <Navbar bg="light" variant="light" className="navbarStyle">
                <a className="navbar-brand" href="/">
                    <img src="https://serdiaceros.com.mx/wp-content/uploads/2022/08/SERDI-logo-web-1.png" alt="" width={"80%"} />
                </a>
                <div className="navbar-collapse justify-content-end">
                    {isAuthenticated ? <Logout /> : <Login />}
                </div>
            </Navbar>
    </>
  )
}
const Login = () => {
  const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.log(e);
        });
    }
    return (
        <Button variant="secondary" onClick={()=>handleLogin()}>Iniciar sesion
            {/* // <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>Sign in using Popup</Dropdown.Item> */}
        </Button>
    )
}
const Logout = () => {
  const { instance } = useMsal();


    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
    }
    return (
        <Button variant="secondary" onClick={()=>handleLogout()}>Cerrar sesion
            {/* // <Dropdown.Item as="button" onClick={() => handleLogout("popup")}>Sign in using Popup</Dropdown.Item> */}
        </Button>
    )
}

export default Index;