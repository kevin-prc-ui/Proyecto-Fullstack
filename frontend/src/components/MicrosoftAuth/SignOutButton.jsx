import React from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
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