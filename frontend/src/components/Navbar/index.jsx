import { Navbar } from "react-bootstrap";
import MicrosoftLoginButton from "../MicrosoftAuth/LoginButton";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

const Index = () => {
  return (
    <>
      <Navbar
        bg="white shadow"
        variant="white"
        className="navbarStyle flex flex-wrap justify-content-between"
      >
        <a className="w-45" href="/">
          <img
            src="https://serdiaceros.com.mx/wp-content/uploads/2022/08/SERDI-logo-web-1.png"
            alt=""
            width={"100%"}
          />
        </a>
        <AuthenticatedTemplate/>
        <UnauthenticatedTemplate>
          <div className="card-title">
            Inicia sesión para ver tu información de perfil.
          </div>
        </UnauthenticatedTemplate>
        <MicrosoftLoginButton /> {/* Reemplaza el Button anterior */}
      </Navbar>
    </>
  );
};
export default Index;
