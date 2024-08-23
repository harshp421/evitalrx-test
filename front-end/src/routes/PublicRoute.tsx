import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute: React.FC = () => {
  return Cookies.get("access_token") ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
