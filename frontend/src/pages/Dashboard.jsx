import React, { useState } from "react";
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

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response),

        );
      });
  }

  return (
    <>
      <h5 className="card-title">Hola {accounts[0].name}</h5>
      {graphData ? (
        <ProfileData graphData={graphData} />
      ) : (
        <Button variant="secondary" onClick={RequestProfileData}>
          Request Profile Information
        </Button>
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
