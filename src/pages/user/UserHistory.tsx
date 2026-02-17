import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { InputGroup, FormControl, Row, Col } from "react-bootstrap";

interface Booking {
  id: number;
  roomName: string;
  roomLocation: string;
  borrowDate: string;
  returnDate: string;
  status: "Pending" | "Approved" | "Rejected";
  purpose: string;
}

const UserHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Approved" | "Rejected"
  >("All");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5006/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        setBookings(data.filter((b: Booking) => b.status !== "Pending"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.roomName.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout allowedRole="User">
      <div
        className="mb-3 p-3 rounded"
        style={{
          backgroundColor: "rgba(173, 216, 230, 0.3)",
          color: "#0b3a82",
        }}
      >
        <h5 className="mb-1">Booking History</h5>
        <em>View all your approved and rejected room bookings.</em>
      </div>

      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <FormControl
              placeholder="Search booking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | "Approved" | "Rejected")
            }
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </Col>
      </Row>

      <div className="table-responsive shadow rounded overflow-hidden">
        <table className="table align-middle mb-0">
          <thead style={{ backgroundColor: "#0b3a82", color: "white" }}>
            <tr>
              <th>No</th>
              <th>Room Name</th>
              <th>Location</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Purpose</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={booking.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  }}
                >
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{booking.roomName}</td>
                  <td>{booking.roomLocation}</td>
                  <td>{new Date(booking.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                  <td>{booking.purpose}</td>
                  <td>
                    {booking.status === "Approved" ? (
                      <span className="badge bg-success">{booking.status}</span>
                    ) : (
                      <span className="badge bg-danger">{booking.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No booking history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default UserHistory;
