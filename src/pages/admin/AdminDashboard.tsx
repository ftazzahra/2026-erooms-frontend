import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [username, setUsername] = useState("Admin");

  const [totalRooms, setTotalRooms] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ===== GET USERNAME =====
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "Admin"
        );
      } catch {
        setUsername("Admin");
      }
    }

    // ===== FETCH DASHBOARD DATA =====
    const fetchData = async () => {
      try {
        const resRooms = await fetch(
          "http://localhost:5006/api/Rooms",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const rooms = await resRooms.json();
        setTotalRooms(rooms.length);

        const resBookings = await fetch(
          "http://localhost:5006/api/Bookings/admin",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const bookings = await resBookings.json();

        setTotalBookings(bookings.length);
        setPending(bookings.filter((b: any) => b.status === "Pending").length);
        setApproved(bookings.filter((b: any) => b.status === "Approved").length);
        setRejected(bookings.filter((b: any) => b.status === "Rejected").length);

      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };

    fetchData();
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
          <h5 className="fw-bold mb-1">
            Hi {username}, welcome back
          </h5>
          <small className="text-muted">
            Manage rooms and bookings here
          </small>
        </div>
      </div>

      {/* ===== ROW 1 ===== */}
      <div className="row g-4 mb-3">

        {/* TOTAL ROOMS */}
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
                <h4 className="fw-bold mb-0">{totalRooms}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL BOOKINGS */}
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
                <h4 className="fw-bold mb-0">{totalBookings}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="row g-4">

        {/* PENDING */}
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
                <h6 className="text-muted mb-1">Pending Bookings</h6>
                <h4 className="fw-bold mb-0">{pending}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* APPROVED */}
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
                <h6 className="text-muted mb-1">Approved Bookings</h6>
                <h4 className="fw-bold mb-0">{approved}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* REJECTED */}
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
                <h6 className="text-muted mb-1">Rejected Bookings</h6>
                <h4 className="fw-bold mb-0">{rejected}</h4>
              </div>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;
