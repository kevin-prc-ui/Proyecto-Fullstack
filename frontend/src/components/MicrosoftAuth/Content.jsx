import  { useState } from 'react';
import '../../styles/index.css';
import { PageLayout } from './PageLayout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import {Button} from 'react-bootstrap';
import { loginRequest } from '../../services/authConfig.js';
import { callMsGraph } from '../../services/graph';
import { ProfileData } from './ProfileData';
import { Navigate } from 'react-router-dom';


/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
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
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });

    }

    return (
        <>

        <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="primary" onClick={RequestProfileData}>
                    Request Profile Information 
                </Button>
            )}            
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="Content">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function Content() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
