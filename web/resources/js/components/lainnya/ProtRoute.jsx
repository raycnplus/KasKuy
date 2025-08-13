import React, { useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtRoute() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const shownRef = useRef(false);

  if (!token) {
    if (!shownRef.current) {
      toast.error("Anda harus login terlebih dahulu untuk mengakses halaman ini", {
        position: "top-center",
        duration: 2000,
      });
      shownRef.current = true;
    }
    // Simpan dari mana user datang, kalau mau dipakai setelah login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
