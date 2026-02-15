import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { InputGroup, FormControl, Dropdown } from "react-bootstrap";

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
  const [search, setSearch] = useState(""); // search state
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Rejected">("All");

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

        // Filter hanya yang bukan Pending
        setBookings(data.filter((b: Booking) => b.status !== "Pending"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  // Filter berdasarkan search dan status
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
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3 rounded"
        style={{
          backgroundColor: "rgba(173, 216, 230, 0.3)",
          color: "#0b3a82",
        }}
      >
        <h5 className="text-xl font-bold mb-0">Booking History</h5>

        <div className="d-flex gap-2">
          {/* Search */}
          <InputGroup style={{ maxWidth: "200px" }}>
            <InputGroup.Text>🔍</InputGroup.Text>
            <FormControl
              placeholder="Search booking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {/* Status Filter */}
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              {statusFilter === "All" ? "Filter" : statusFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setStatusFilter("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter("Approved")}>
                Approved
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter("Rejected")}>
                Rejected
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Table */}
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
