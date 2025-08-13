// main.jsx
import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// Pages
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Auth";
import Signup from "./Pages/Auth";
import OTP from "./Pages/OTP";
import D2 from "./Pages/d2";
import RDashboard from "./Pages/R/RDashboard";
import RCatat from "./Pages/R/RCatat";
import RDKas from "./Pages/R/RDaftarKas";
import RAnalitik from "./Pages/R/RAnalitik";
import RCategory from "./Pages/R/RCategory";
import Splitbill from "./Pages/R/Splitbill";
import Friends from "./Pages/R/Friends";
import Settings from "./Pages/R/Settings.jsx";
// Protected wrapper
import ProtRoute from "./components/lainnya/ProtRoute";

// 404: tampilkan toast lalu redirect ke "/"
function NotFound() {
  useEffect(() => {
    toast.error("Halaman tidak ditemukan!", { position: "top-center", duration: 2000 });
  }, []);
  return <Navigate to="/" replace />;
}

// Fallback super ringan biar gak blank saat render awal
function AppFallback() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div>Memuat…</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
    <Suspense fallback={<AppFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/secret" element={<D2 />} />

        {/* Protected */}
        <Route element={<ProtRoute />}>
          <Route path="/dashboard" element={<RDashboard />} />
          <Route path="/catat" element={<RCatat />} />
          <Route path="/daftarkas" element={<RDKas />} />
          <Route path="/analitik" element={<RAnalitik />} />
            <Route path="/split-bill" element={<Splitbill />} />
            <Route path="/settingsa/friends" element={<Friends />} />
            <Route path="/settings" element={<Settings />} />
          <Route path="/settings/category" element={<RCategory />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
