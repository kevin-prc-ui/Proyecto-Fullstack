import { Navbar } from "react-bootstrap";
import Button from "../MicrosoftAuth/LoginButton";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

const Index = () => {
  return (
    <>
      <Navbar
        bg="white shadow"
        variant="white"
        className="navbarStyle flex-wrap justify-content-between"
      >
        <a className="navbar-brand" href="/">
          <img
            src="https://serdiaceros.com.mx/wp-content/uploads/2022/08/SERDI-logo-web-1.png"
            alt=""
            width={"80%"}
          />
        </a>
        <AuthenticatedTemplate>
          <ProfileContent />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className="card-title">
            Inicia sesión para ver tu información de perfil.
          </div>
        </UnauthenticatedTemplate>
        <Button />
      </Navbar>
    </>
  );
};
const ProfileContent = () => {
  const { accounts } = useMsal();
 
  return (
    <>
      <div className="card-title">Bienvenido, {accounts[0].name}!</div>
    </>
  );
};
export default Index;
