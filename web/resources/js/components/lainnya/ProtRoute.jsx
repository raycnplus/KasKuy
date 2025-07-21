import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtRoute({ role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
