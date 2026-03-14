import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";

function ProtectedRoute({ allowedPermissions }) {
  const { globalState } = useGlobalState();
  const user = globalState?.user;

  // agar login hi nahi hai
  if (!user) return <Navigate to="/login" replace />;

  // agar specific permission required hai
  if (allowedPermissions?.length > 0) {
    const hasPermission = allowedPermissions.some((p) =>
      user?.role?.permissions?.includes(p)
    );
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // agar sab ok hai
  return <Outlet />;
}

export default ProtectedRoute;
