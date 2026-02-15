import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRole?: "Admin" | "User";
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("token");

  // jika belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const role =
      payload[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] || payload.role;

    // jika role tidak sesuai
    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
