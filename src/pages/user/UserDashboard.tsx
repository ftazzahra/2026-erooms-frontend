import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  status: "Pending" | "Approved" | "Rejected";
}

const UserDashboard = () => {
  const [username, setUsername] = useState("User");
  const [bookings, setBookings] = useState<Booking[]>([]);

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

    // Fetch bookings
    const fetchBookings = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5006/api/Bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  // Hitung status
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const approved = bookings.filter((b) => b.status === "Approved").length;
  const rejected = bookings.filter((b) => b.status === "Rejected").length;

  return (
    <DashboardLayout allowedRole="User">
      <div
        className="card border-0 mb-4"
        style={{
          background: "rgba(173, 216, 230, 0.25)", 
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="card-body">
          <h5 className="fw-bold mb-1">Hi {username}, welcome back</h5>
          <small className="text-muted">Here’s your booking summary</small>
        </div>
      </div>

      <div className="row g-4 mb-2">
        <div className="col-md-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total My Bookings</h6>
              <h3 className="fw-bold mb-0">{total}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Pending Bookings</h6>
              <h4 className="fw-bold text-warning mb-0">{pending}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Approved Bookings</h6>
              <h4 className="fw-bold text-success mb-0">{approved}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Rejected Bookings</h6>
              <h4 className="fw-bold text-danger mb-0">{rejected}</h4>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
