import Cookies from 'js-cookie';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  
  return Cookies.get("access_token") ? <Outlet /> : <Navigate to="/login" />;
  
};

export default PrivateRoute;
