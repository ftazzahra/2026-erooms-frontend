import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  Table,
  Row,
  Col,
  Card,
  Dropdown,
  Badge,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiFileText, FiInfo } from "react-icons/fi"; // import ikon

interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  roomLocation: string;
  roomCapacity: number;
  borrowDate: string;
  returnDate: string;
  status: string;
  purpose: string;
}

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");

  // modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<{
    borrowDate: string;
    returnDate: string;
    purpose: string;
  }>({
    borrowDate: "",
    returnDate: "",
    purpose: "",
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5006/api/bookings/my", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.filter((b: Booking) => b.status === "Pending"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`http://localhost:5006/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      alert("Booking deleted successfully");
      fetchBookings();
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting booking");
    }
  };

  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData({
      borrowDate: booking.borrowDate.split("T")[0],
      returnDate: booking.returnDate.split("T")[0],
      purpose: booking.purpose,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`http://localhost:5006/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          roomId: selectedBooking.roomId,
          borrowDate: editData.borrowDate,
          returnDate: editData.returnDate,
          purpose: editData.purpose,
        }),
      });

      if (!res.ok) throw new Error("Failed to update booking");
      alert("Booking updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Error updating booking");
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.roomName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRole="User">
      {/* Header halaman */}
      <div
        className="mb-3 p-3 rounded d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "rgba(173, 216, 230, 0.3)",
          color: "#0b3a82",
        }}
      >
        <h5 className="mb-0">My Bookings</h5>
        <InputGroup className="w-auto" style={{ maxWidth: "300px" }}>
          <InputGroup.Text>🔍</InputGroup.Text>
          <FormControl
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Card info */}
      <Card
        className="mb-3 p-3"
        style={{
          backgroundColor: "rgba(238, 255, 80, 0.2)",
          color: "#0b3a82",
          border: "none",
        }}
      >
        <p className="mb-0">
          - For Approved/Rejected bookings, check the{" "}
          <Link
            to="/user/history"
            style={{ color: "#0b3a82", textDecoration: "underline" }}
          >
            History
          </Link>{" "}
          page.
        </p>
        <p className="mb-0">
           - Please refresh after the data is updated.
        </p>
      </Card>

      <Row>
        {/* Tabel kiri */}
        <Col md={5}>
          {loading ? (
            <p>Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <p>No pending bookings found.</p>
          ) : (
            <Table striped bordered hover>
              <thead
                style={{
                  backgroundColor: "rgba(173, 216, 230, 0.3)",
                  color: "#0b3a82",
                }}
              >
                <tr>
                  <th>No</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b, index) => (
                  <tr
                    key={b.id}
                    style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white" }}
                  >
                    <td>{index + 1}</td>
                    <td>{b.roomName}</td>
                    <td>
                      <Badge bg="warning">{b.status}</Badge>
                    </td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="link"
                          id={`dropdown-${b.id}`}
                          style={{ textDecoration: "none", padding: 2, fontWeight: "bold" }}
                        >
                          ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setSelectedBooking(b)}>
                            <FiInfo /> &nbsp;Detail
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditClick(b)}>
                            <FiEdit /> &nbsp;Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(b.id)}>
                            <FiTrash2 /> &nbsp;Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>

        {/* Detail kanan */}
        <Col md={7}>
          <Card>
            <Card.Header>Booking Details</Card.Header>
            <Card.Body>
              {selectedBooking ? (
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Room:</strong> {selectedBooking.roomName}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedBooking.roomLocation}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {selectedBooking.roomCapacity} persons
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Borrow Date:</strong>{" "}
                      {new Date(selectedBooking.borrowDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Return Date:</strong>{" "}
                      {new Date(selectedBooking.returnDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Badge bg="warning">{selectedBooking.status}</Badge>
                    </p>
                    <p>
                      <strong>Purpose:</strong> {selectedBooking.purpose}
                    </p>
                  </Col>
                </Row>
              ) : (
                <p className="text-muted">Select a booking to view details.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      {showEditModal && selectedBooking && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Booking</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body">
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Room Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedBooking.roomName}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Borrow Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.borrowDate}
                        onChange={(e) =>
                          setEditData({ ...editData, borrowDate: e.target.value })
                        }
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Return Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editData.returnDate}
                        onChange={(e) =>
                          setEditData({ ...editData, returnDate: e.target.value })
                        }
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Purpose</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.purpose}
                        onChange={(e) =>
                          setEditData({ ...editData, purpose: e.target.value })
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                  disabled={!editData.borrowDate || !editData.returnDate || !editData.purpose}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserBookings;
