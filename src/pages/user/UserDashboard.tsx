import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUsername(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "User",
        );
      } catch {
        setUsername("User");
      }
    }
  }, []);

  return (
    <DashboardLayout allowedRole="User">
      {/* ===== WELCOME CARD ===== */}
      <div
        className="card border-0 mb-4"
        style={{
          background: "rgba(255, 193, 7, 0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="card-body">
          <h5 className="fw-bold mb-1">Hi {username}, welcome back</h5>
          <small className="text-muted">Here’s your booking summary</small>
        </div>
      </div>

      {/* ===== ROW 1 ===== */}
      <div className="row g-4 mb-2">
        <div className="col-md-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total My Bookings</h6>
              <h3 className="fw-bold mb-0">12</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Pending Bookings</h6>
              <h4 className="fw-bold text-warning mb-0">3</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Approved Bookings</h6>
              <h4 className="fw-bold text-success mb-0">7</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Rejected Bookings</h6>
              <h4 className="fw-bold text-danger mb-0">2</h4>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
