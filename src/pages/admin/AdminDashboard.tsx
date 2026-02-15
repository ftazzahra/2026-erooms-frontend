import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUsername(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "Admin",
        );
      } catch {
        setUsername("Admin");
      }
    }
  }, []);

  return (
    <DashboardLayout allowedRole="Admin">
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
          <small className="text-muted">Manage rooms and bookings here</small>
        </div>
      </div>

      {/* ===== ROW 1 ===== */}
      <div className="row g-4 mb-2">
        {/* Total Rooms */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#0d6efd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-door-open text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">Total Rooms</h6>
                <h4 className="fw-bold mb-0">25</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#198754",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-calendar-check text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">Total Bookings</h6>
                <h4 className="fw-bold mb-0">142</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="row mt-1 g-4">
        {/* Pending */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#ffc107",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-hourglass-split text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">Pending Rooms</h6>
                <h4 className="fw-bold mb-0">18</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#198754",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-check-circle text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">Approved Rooms</h6>
                <h4 className="fw-bold mb-0">96</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div
                className="me-3"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-x-circle text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">Rejected Rooms</h6>
                <h4 className="fw-bold mb-0">28</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
