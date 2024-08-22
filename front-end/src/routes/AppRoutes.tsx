import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import Register from '../modules/auth/Register';
import Login from '../modules/auth/Login';
import ForgetPassword from '../modules/auth/ForgetPassword';
import OTP from '../modules/auth/OTP';
import PrivateRoute from './PrivetRoutes';
import Dashboard from '../modules/dashboard/Dashboard';
import Profile from '../modules/Profile/Profile';
import AuthLayout from '@/layout/AuthLayout';




const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
       <Route  element={<AuthLayout/>} >
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
