import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  status: "Pending" | "Approved" | "Rejected";
}

const AdminDashboard = () => {
  const [username, setUsername] = useState(""); // ambil dari API
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const baseUrl = "http://localhost:5006";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // get username from api
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUsername(data.username);
      } catch (err) {
        console.error(err);
        setUsername("Admin"); // fallback
      }
    };

    // get rooms and bookings data
    const fetchDashboardData = async () => {
      try {
        const resRooms = await fetch(`${baseUrl}/api/Rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rooms = await resRooms.json();
        setTotalRooms(rooms.length);

        const resBookings = await fetch(`${baseUrl}/api/Bookings/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookings: Booking[] = await resBookings.json();

        setTotalBookings(bookings.length);
        setPending(bookings.filter((b) => b.status === "Pending").length);
        setApproved(bookings.filter((b) => b.status === "Approved").length);
        setRejected(bookings.filter((b) => b.status === "Rejected").length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout allowedRole="Admin">
      {/* welcome card */}
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

      {/* row 1 */}
      <div className="row g-4 mb-3">
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

      {/* row 2 */}
      <div className="row g-4">
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