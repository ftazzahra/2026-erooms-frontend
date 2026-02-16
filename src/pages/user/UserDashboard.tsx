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

    // ===== GET USERNAME =====
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "User"
        );
      } catch {
        setUsername("User");
      }
    }

    // fetch bookings data
    const fetchBookings = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:5006/api/Bookings/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  //count status
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const approved = bookings.filter((b) => b.status === "Approved").length;
  const rejected = bookings.filter((b) => b.status === "Rejected").length;

  return (
    <DashboardLayout allowedRole="User">

      {/* welcome card */}
      <div
        className="card border-0 mb-4"
        style={{
          background: "rgba(173, 216, 230, 0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="card-body">
          <h5 className="fw-bold mb-1">
            Hi {username}, welcome back
          </h5>
          <small className="text-muted">
            Here’s your booking summary
          </small>
        </div>
      </div>

      {/* total booking */}
      <div className="row g-4 mb-3">
        <div className="col-md-12">
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
                <i className="bi bi-calendar-event text-white"></i>
              </div>

              <div>
                <h6 className="text-muted mb-1">
                  Total My Bookings
                </h6>
                <h4 className="fw-bold mb-0">{total}</h4>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* status card */}
      <div className="row g-4">

        {/* pending */}
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
                <h6 className="text-muted mb-1">
                  Pending Bookings
                </h6>
                <h4 className="fw-bold text-warning mb-0">
                  {pending}
                </h4>
              </div>

            </div>
          </div>
        </div>

        {/* approved */}
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
                <h6 className="text-muted mb-1">
                  Approved Bookings
                </h6>
                <h4 className="fw-bold text-success mb-0">
                  {approved}
                </h4>
              </div>

            </div>
          </div>
        </div>

        {/* rejected */}
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
                <h6 className="text-muted mb-1">
                  Rejected Bookings
                </h6>
                <h4 className="fw-bold text-danger mb-0">
                  {rejected}
                </h4>
              </div>

            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default UserDashboard;
