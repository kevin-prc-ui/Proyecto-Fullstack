import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { callMsGraph } from "../../graph";
import { login } from "../../services/UsuarioService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  return <div>{isAuthenticated ? <Logout /> : <Login />}</div>;
};

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();


  // login handler
  const handleLogin = async () => {
    try {
      // 1. Inicio del login
      const response = await instance.loginPopup(loginRequest);

      // 2. Se obtienen los datos del usuario una vez se hace el login
      const graphResponse = await callMsGraph(response.accessToken);

      // 3. Se crea el json con los datos del usuario y se comprueba si existe o no en la base de datos
      const loginData = {
        email: graphResponse.userPrincipalName,
        password: graphResponse.id,
      };

      const respuesta = await login(loginData);
      const token = respuesta.data;
      // Assuming your backend returns the token like this
      sessionStorage.setItem("authToken", JSON.stringify(token)); // Store the token
      navigate("/dashboard");
      toast.info("Se ha iniciado sesión correctamente.")
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(`Error de autenticación: ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <a style={{ marginRight: "10px" }} href="/signup" className=" text-black hover:text-white hover:bg-blue-100 rounded px-4 py-2 text-decoration-none cursor-pointer">
        Crear cuenta
      </a>
      
      <Button variant="dark" onClick={handleLogin}>
        Acceder
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
    sessionStorage.removeItem("authToken");
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
