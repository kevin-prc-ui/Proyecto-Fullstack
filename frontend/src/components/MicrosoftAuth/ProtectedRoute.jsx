import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';
import { loginRequest } from '../../services/authConfig'; // Import loginRequest from the appropriate file
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) {
        instance.loginRedirect(loginRequest);
        return <Navigate to="/" replace />;
    }

    return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;