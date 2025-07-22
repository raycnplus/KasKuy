// app.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Auth';
import Signup from './Pages/Auth';
import OTP from './Pages/OTP';
import Dashboard from './Pages/Dashboard'
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <BrowserRouter>
  <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
