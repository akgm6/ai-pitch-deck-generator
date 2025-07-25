import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import SlideForm from './SlideForm';
import RequireAuth from './RequireAuth';
import LandingPage from './LandingPage';
import Signup from './Signup';
import { Box, Typography } from '@mui/material';

function ForgotPassword() {
  return <Box p={4}><Typography variant="h4">Forgot Password Page</Typography></Box>;
}
function Dashboard() {
  return <Box p={4}><Typography variant="h4">Dashboard (Protected)</Typography></Box>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={
          <RequireAuth>
            <SlideForm />
          </RequireAuth>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
