import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    return isAuthenticated ? Component : <Navigate to="/" replace />;
};

export default PrivateRoute;
