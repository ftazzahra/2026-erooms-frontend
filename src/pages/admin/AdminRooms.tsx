import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
}

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"All" | "Available" | "Not Available">("All");

  const [sortField, setSortField] =
    useState<keyof Room | "none">("none");
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("asc");

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: 1,
    isAvailable: true,
  });

  // ✅ ERROR STATE
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  // ✅ TOAST SUCCESS
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ===== FETCH =====
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5006/api/Rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ===== FILTER =====
  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Available" && r.isAvailable) ||
      (filterStatus === "Not Available" && !r.isAvailable);

    return matchSearch && matchStatus;
  });

  // ===== SORT =====
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortField === "none") return 0;

    let A: any = a[sortField];
    let B: any = b[sortField];

    if (typeof A === "string") A = A.toLowerCase();
    if (typeof B === "string") B = B.toLowerCase();

    if (A < B) return sortOrder === "asc" ? -1 : 1;
    if (A > B) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: keyof Room) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ===== OPEN MODAL =====
  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
    } else {
      setEditingRoom(null);
      setFormData({
        name: "",
        location: "",
        capacity: 1,
        isAvailable: true,
      });
    }

    // reset error saat buka modal
    setErrors({
      name: "",
      location: "",
      capacity: "",
    });

    setShowModal(true);
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    const newErrors = {
      name: "",
      location: "",
      capacity: "",
    };

    if (!formData.name.trim())
      newErrors.name = "Room name is required";

    if (!formData.location.trim())
      newErrors.location = "Location is required";

    if (formData.capacity <= 0)
      newErrors.capacity = "Capacity must be at least 1";

    setErrors(newErrors);

    if (newErrors.name || newErrors.location || newErrors.capacity) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const url = editingRoom
        ? `http://localhost:5006/api/Rooms/${editingRoom.id}`
        : "http://localhost:5006/api/Rooms";

      const method = editingRoom ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchRooms();

      setToastMessage(
        editingRoom
          ? "Room updated successfully!"
          : "Room added successfully!"
      );
      setShowToast(true);

    } catch (err) {
      alert("Error saving room");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Delete "${room.name}"?`)) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5006/api/Rooms/${room.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRooms();

    setToastMessage("Room deleted successfully!");
    setShowToast(true);
  };

  // ===== UI =====
  return (
    <DashboardLayout allowedRole="Admin">

      <Card
        className="mb-3 p-3"
        style={{
          backgroundColor: "rgba(173,216,230,0.3)",
          border: "none",
          color: "#0b3a82",
        }}
      >
        <h5 className="mb-1">Room Management</h5>
        <em>Manage rooms and availability.</em>
      </Card>

      {/* SEARCH + FILTER */}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{ color: "blue" }}>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={3}>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option>All</option>
            <option>Available</option>
            <option>Not Available</option>
          </select>
        </Col>

        <Col className="d-flex justify-content-end">
          <Button variant="success" onClick={() => handleOpenModal()}>
            <FaPlus /> Add Room
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive shadow rounded overflow-hidden">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              {["id", "name", "location", "capacity", "isAvailable"].map(
                (col) => (
                  <th
                    key={col}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSort(col as keyof Room)}
                  >
                    {col === "id"
                      ? ""
                      : col === "isAvailable"
                      ? "Status"
                      : col.charAt(0).toUpperCase() + col.slice(1)}
                  </th>
                )
              )}
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              sortedRooms.map((room, i) => (
                <tr key={room.id}>
                  <td>{i + 1}</td>
                  <td>{room.name}</td>
                  <td>{room.location}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <Badge bg={room.isAvailable ? "success" : "secondary"}>
                      {room.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </td>

                  <td className="text-center d-flex justify-content-center gap-2">
                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleOpenModal(room)}
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
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(room)}
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
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* TOAST */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={2500} bg="success">
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRoom ? "Edit Room" : "Add Room"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Room Name *</Form.Label>
              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity *</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: Number(e.target.value),
                  })
                }
                isInvalid={!!errors.capacity}
              />
              <Form.Control.Feedback type="invalid">
                {errors.capacity}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status *</Form.Label>
              <Form.Select
                value={formData.isAvailable ? "yes" : "no"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isAvailable: e.target.value === "yes",
                  })
                }
              >
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </DashboardLayout>
  );
};

export default AdminRooms;
