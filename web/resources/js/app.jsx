import { React, Navigate } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import ProtRoute from "./components/lainnya/ProtRoute";
import Login from "./Pages/Auth";
import Signup from "./Pages/Auth";
import OTP from "./Pages/OTP";
import Notfound from "./Pages/Notfound";
import Dashboard from "./Pages/user/Dashboard";
import Catat from "./Pages/user/Catat";
import DaftarKas from "./Pages/user/DaftarKas";
import Analitik from "./Pages/user/Analitik";
import D2 from "./Pages/d2";
import RDashboard from "./Pages/R/RDashboard";
import RCatat from "./Pages/R/RCatat";
import RDKas from "./Pages/R/RDaftarKas";
import RAnalitik from "./Pages/R/RAnalitik";
import RLPage from "./Pages/R/RLandingpage";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/secret" element={<D2 />} />
            <Route path="/sds" element={<RDashboard />} />
            <Route path="/sct" element={<RCatat />} />
            <Route path="/sdk" element={<RDKas />} />
            <Route path="/san" element={<RAnalitik />} />
            <Route path="/sdk" element={<RDKas />} />
            <Route path="/slp" element={<RLPage />} />
            <Route element={<ProtRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/catat" element={<Catat />} />
                <Route path="/daftarkas" element={<DaftarKas />} />
                <Route path="/analitik" element={<Analitik />} />
            </Route>
            <Route path="*" element={<Notfound />} />
        </Routes>
    </BrowserRouter>
);
