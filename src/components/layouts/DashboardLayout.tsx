import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
  allowedRole: "Admin" | "User";
}

const DashboardLayout = ({ children, allowedRole }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    const role =
      payload[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] || payload.role; 

    if (role !== allowedRole) {
      navigate(role === "Admin" ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [navigate, allowedRole]);

  return (
    <div className="d-flex vh-100">
      <Sidebar role={allowedRole} />

      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />

        <div className="container-fluid p-4 bg-light flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
