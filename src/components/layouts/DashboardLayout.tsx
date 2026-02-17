import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
  allowedRole?: "Admin" | "User" | ("Admin" | "User")[];
}

const DashboardLayout = ({ children, allowedRole }: Props) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"Admin" | "User" | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole =
        (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          payload.role) === "Admin"
          ? "Admin"
          : "User";

      setRole(userRole);

      // cek allowedRole jika ada
      if (allowedRole) {
        const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
        if (!allowed.includes(userRole)) {
          navigate(userRole === "Admin" ? "/admin/dashboard" : "/user/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, allowedRole]);

  if (!role) return null;

  return (
    <div className="d-flex vh-100">
      <Sidebar role={role} />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container-fluid p-4 bg-light flex-grow-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;