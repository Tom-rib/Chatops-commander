import React from 'react';
import { Navigate } from 'react-router-dom';

const Register: React.FC = () => {
  // Rediriger vers login (pas de register pour l'instant)
  return <Navigate to="/login" replace />;
};

export default Register;