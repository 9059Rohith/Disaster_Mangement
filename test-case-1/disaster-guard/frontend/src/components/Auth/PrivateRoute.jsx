// frontend/src/components/Auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// A simple private route implementation that redirects to login if not authenticated
// In a real app, this would connect to your auth context
const PrivateRoute = ({ children }) => {
  // For testing purposes, assume the user is logged in
  // Replace this with actual auth check in a real application
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;