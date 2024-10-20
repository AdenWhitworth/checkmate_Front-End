import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

/**
 * PrivateRoute component checks for user authentication before rendering protected routes.
 * Redirects to the authentication page if the user is not authenticated.
 *
 * @param {PrivateRouteProps} props - The children components to be displayed if authenticated.
 * @returns {JSX.Element} Protected children components or a redirect to authentication page.
 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { currentUser, loadingAuth } = useAuth();
  
    if (loadingAuth) {
      return <LoadingSpinner />;
    }
  
    return currentUser ? children : <Navigate to="/auth" />;
  };

export default PrivateRoute;