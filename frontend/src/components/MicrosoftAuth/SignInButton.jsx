import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../../services/authConfig.js';
import Button from "react-bootstrap/Button";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
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