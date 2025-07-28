import {React, Navigate} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import ProtRoute from "./components/lainnya/ProtRoute";
import Login from "./Pages/Auth";
import Signup from "./Pages/Auth";
import OTP from "./Pages/OTP";
import Notfound from "./Pages/Notfound";
import Dashboard from "./Pages/user/Dashboard";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
  <Route path="/"         element={<LandingPage />} />
  <Route path="/login"    element={<Login />} />
  <Route path="/signup"   element={<Signup />} />
  <Route path="/otp"      element={<OTP />} />
  <Route element={<ProtRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
  <Route path="*" element={<Notfound />} />
</Routes>

    </BrowserRouter>
);
