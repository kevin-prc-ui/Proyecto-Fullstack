
import { Navbar } from "react-bootstrap";
import Button from '../MicrosoftAuth/LoginButton'


const Index = () => {

  return (
    <>
      <Navbar bg="white shadow" variant="white" className="navbarStyle">
        <a className="navbar-brand" href="/">
          <img
            src="https://serdiaceros.com.mx/wp-content/uploads/2022/08/SERDI-logo-web-1.png"
            alt=""
            width={"80%"}
          />
        </a>
        <Button/>
      </Navbar>
    </>
  );
};


export default Index;