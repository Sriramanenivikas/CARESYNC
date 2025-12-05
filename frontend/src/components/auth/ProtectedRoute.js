import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../common';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
