import React, { useEffect, useState } from "react";
import "../styles/index.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import { loginRequest } from "../services/authConfig";
import { callMsGraph } from "../graph";
// import { ProfileData } from "../components/MicrosoftAuth/ProfileData";

const Dashboard = () => {
  return (
    <>
      <div className="App">
        <AuthenticatedTemplate>
          <ProfileContent />
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <h5 className="card-title">
            Please sign-in to see your profile information.
          </h5>
        </UnauthenticatedTemplate>
      </div>
    </>
  );
};
const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraph(response.accessToken).then((response) => {
            setGraphData(response);
          });
        })
        .catch((error) => {
          console.error("Error acquiring token:", error);
          // Optionally trigger interactive login
        });
    }
  }, [instance, accounts]); // Added dependency array

  if (!accounts || accounts.length === 0) {
    return <div>No account information available</div>;
  }

  return (
    <>
      <h5 className="card-title">Hola {accounts[0]?.name}</h5>
      {graphData ? (
        <ProfileData graphData={graphData} />
      ) : (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </>
  );
};

export const ProfileData = (props) => {
  return (
      <div id="profile-div">
          <p><strong>First Name: </strong> {props.graphData.givenName}</p>
          <p><strong>Last Name: </strong> {props.graphData.surname}</p>
          <p><strong>Email: </strong> {props.graphData.userPrincipalName}</p>
          <p><strong>Id: </strong> {props.graphData.id}</p>
      </div>
  );
};

export default Dashboard;
