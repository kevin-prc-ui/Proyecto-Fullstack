import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../services/authConfig";
import Button from "react-bootstrap/Button";
import { callMsGraph } from "../../graph";
import { login } from "../../services/UsuarioService";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { UseLoginHandler, UseLogoutHandler} from "./ButtonHandler";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";

const MyButton = () => {
  const isAuthenticated = useIsAuthenticated();
  return <div>{isAuthenticated ? <Logout /> : <Login />}</div>;
};

export const Login = () => {
  const { handleLogin } = UseLoginHandler();

  return (
    <div className="flex gap-2">
      <Link
        to="/signup"
        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors text-decoration-none"
      >
        <FaUserPlus className="mr-1" />
        Crear cuenta
      </Link>
      
      <Link 
        onClick={handleLogin}
        className="flex items-center gap-1 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors text-decoration-none"
      >
        <FaSignInAlt className="mr-1" />
        Acceder
      </Link>
    </div>
  );
};

export const Logout = () => {
  const { handleLogout } = UseLogoutHandler();

  return (
    <Link
      onClick={handleLogout}
      className="max-w-45 flex items-center gap-1 bg-red-500 px-4 py-2 text-white hover:bg-red-600 rounded-lg transition-colors text-decoration-none"
    >
      <FaSignOutAlt className="mr-1" />
      Cerrar sesión
    </Link>
  );
};

export default MyButton;
