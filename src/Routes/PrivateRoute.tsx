import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider/AuthProvider';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { currentUser, loadingAuth } = useAuth();
  
    if (loadingAuth) {
      return <div>Loading...</div>;
    }
  
    return currentUser ? children : <Navigate to="/auth" />;
  };

export default PrivateRoute;
