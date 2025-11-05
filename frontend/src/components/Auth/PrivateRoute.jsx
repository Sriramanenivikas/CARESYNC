import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, getDashboardRoute } from '../../utils/authUtils';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to user's appropriate dashboard if they don't have permission
    const dashboardRoute = getDashboardRoute(userRole);
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default PrivateRoute;
