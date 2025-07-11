import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token, redirect to the sign-in page
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute; 