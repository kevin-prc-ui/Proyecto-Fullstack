import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkOrCreateUser } from "../../services/UsuarioService";
import {handleApiError} from "../../utils/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace this with your actual login API call
        const userData = {
            email: email,
            password: password, // in real app hash the password
            
        };
        const response = await checkOrCreateUser(userData);

        const token = response.data.token; // Assuming your backend returns the token like this
        localStorage.setItem("authToken", token); // Store the token

        console.log('Login successful!');
        navigate("/"); // Redirect to a protected route
      } catch (error) {
        handleApiError(error,"Error al loguear usuario")
      } finally {
        setLoading(false);
      }
    };

  return (
    // ... your login form code ...
    <form onSubmit={handleSubmit}>
        {/* ... Form Inputs for email and password... */}
        <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
        </button>
    </form>
    // ...
  );
};

export default Login;
