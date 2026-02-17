import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  Table,
  Button,
  Modal,
  Badge,
  InputGroup,
  FormControl,
  Card,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
} from "react-icons/fa";

import { Link } from "react-router-dom";

interface Booking {
  id: number;
  userId: number;
  userName: string;
  roomId: number;
  roomName: string;
  roomLocation: string;
  roomCapacity: number;
  borrowDate: string;
  returnDate: string;
  status: string;
  purpose: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const [sortField, setSortField] = useState<keyof Booking | "none">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // fetch bookings data
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5006/api/Bookings/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // update status
  const handleUpdateStatus = async (
    bookingId: number,
    status: "Approved" | "Rejected"
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to ${status.toLowerCase()} this booking?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5006/api/Bookings/admin/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(status),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // succest toast
      setToast({
        show: true,
        message: `Booking ${status} successfully`,
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error updating booking status");
    }
  };

  const handleShowDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // fitler n search
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.roomName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "All" || b.status === filterStatus;

    return matchSearch && matchStatus;
  });

  // sorting
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortField === "none") return 0;

    let fieldA: any = a[sortField];
    let fieldB: any = b[sortField];

    if (sortField === "borrowDate" || sortField === "returnDate") {
      fieldA = new Date(fieldA).getTime();
      fieldB = new Date(fieldB).getTime();
    }

    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });

  const toggleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <DashboardLayout allowedRole="Admin">

      {/* blue card */}
      <Card
        className="mb-2 p-3"
        style={{
          backgroundColor: "rgba(173,216,230,0.3)",
          border: "none",
          color: "#0b3a82",
        }}
      >
        <h5 className="mb-1">Bookings Management</h5>
        <em>
          Manage all current bookings. Approve or reject pending requests,
          view booking details, and monitor booking status in real-time.
        </em>
      </Card>

      {/* yllow info card  */}
      <Card
        className="mb-3 p-3"
        style={{
          backgroundColor: "rgba(255,255,0,0.2)",
          border: "none",
          color: "#0b3a82",
        }}
      >
        <em>
          - For Approved/Rejected bookings, check the{" "}
          <Link
            to="/admin/history"
            style={{ color: "#0b3a82", textDecoration: "underline" }}
          >
            History
          </Link>{" "}
          page. <br />
          - Click column headers to sort the table.
        </em>
      </Card>

      {/* filter n search*/}
      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text style={{ color: "blue", borderColor: "blue" }}>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Search by user or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderColor: "blue" }}
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              borderColor: "blue",
              color: "#0b3a82",
              fontWeight: "bold",
            }}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </Col>
      </Row>


      <div className="table-responsive shadow rounded overflow-hidden">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              {[
                "id",
                "userName",
                "roomName",
                "borrowDate",
                "returnDate",
                "purpose",
                "status",
              ].map((col, i) => (
                <th
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort(col as keyof Booking)}
                >
                  {col === "id"
                    ? "No"
                    : col === "userName"
                    ? "User"
                    : col === "roomName"
                    ? "Room"
                    : col === "borrowDate"
                    ? "Borrow Date"
                    : col === "returnDate"
                    ? "Return Date"
                    : col === "purpose"
                    ? "Purpose"
                    : "Status"}{" "}
                  {sortField === col &&
                    (sortOrder === "asc" ? (
                      <FaArrowUp size={12} style={{ marginLeft: 4 }} />
                    ) : (
                      <FaArrowDown size={12} style={{ marginLeft: 4 }} />
                    ))}
                </th>
              ))}
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : sortedBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              sortedBookings.map((b, idx) => {
                const isPending = b.status === "Pending";
                const mutedStyle = !isPending ? { opacity: 0.5 } : {};

                return (
                  <tr key={b.id} style={mutedStyle}>
                    <td>{idx + 1}</td>
                    <td>{b.userName}</td>
                    <td>{b.roomName}</td>
                    <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(b.returnDate).toLocaleDateString()}</td>
                    <td>{b.purpose}</td>
                    <td>
                      <Badge
                        bg={
                          b.status === "Pending"
                            ? "warning"
                            : b.status === "Approved"
                            ? "success"
                            : "danger"
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>

                    <td className="text-center d-flex justify-content-center gap-2">
                      <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>}>
                        <Button
                          variant="success"
                          size="sm"
                          disabled={!isPending}
                          onClick={() => handleUpdateStatus(b.id, "Approved")}
                          style={{
                            borderRadius: "100%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaCheck />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Reject</Tooltip>}>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={!isPending}
                          onClick={() => handleUpdateStatus(b.id, "Rejected")}
                          style={{
                            borderRadius: "100%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaTimes />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger overlay={<Tooltip>Detail</Tooltip>}>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleShowDetail(b)}
                          style={{
                            borderRadius: "100%",
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <FaInfoCircle />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>



      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Detail</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedBooking && (
            <>
              <p><strong>User:</strong> {selectedBooking.userName}</p>
              <p><strong>Room:</strong> {selectedBooking.roomName} ({selectedBooking.roomLocation})</p>
              <p><strong>Capacity:</strong> {selectedBooking.roomCapacity}</p>
              <p><strong>Location:</strong> {selectedBooking.roomLocation}</p>
              <p><strong>Borrow Date:</strong> {new Date(selectedBooking.borrowDate).toLocaleDateString()}</p>
              <p><strong>Return Date:</strong> {new Date(selectedBooking.returnDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Purpose:</strong> {selectedBooking.purpose}</p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          show={toast.show}
          delay={3000}
          autohide
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </DashboardLayout>
  );
};

export default AdminBookings;
