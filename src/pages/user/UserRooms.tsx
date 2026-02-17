import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";

interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
}

interface BookingRequestDto {
  roomId: number;
  borrowDate: string;
  returnDate: string;
  purpose: string;
}

const UserRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | "Available" | "Not Available">("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // get username from api
        const profileRes = await fetch(
          "http://localhost:5006/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUsername(profile.username);
        } else {
          setUsername("User");
        }

        // fetch rooms
        const res = await fetch("http://localhost:5006/api/Rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch rooms");

        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  const handleBookingClick = (room: Room) => {
    setSelectedRoom(room);
    setBorrowDate("");
    setReturnDate("");
    setPurpose("");
    setShowModal(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedRoom) return;

    try {
      const token = localStorage.getItem("token");

      const payload: BookingRequestDto = {
        roomId: selectedRoom.id,
        borrowDate,
        returnDate,
        purpose,
      };

      const res = await fetch("http://localhost:5006/api/Bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create booking");

      alert("Booking created successfully!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creating booking");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Available"
        ? room.isAvailable
        : !room.isAvailable;

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
        <h5 className="mb-1">Room List</h5>
        <em>Browse available rooms and request a loan.</em>
      </div>

      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <FormControl
              placeholder="Search rooms..."
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
              setStatusFilter(
                e.target.value as "All" | "Available" | "Not Available"
              )
            }
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </Col>
      </Row>

      <div className="table-responsive shadow rounded overflow-hidden">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>No</th>
              <th>Room Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => {
                const isAvailable = room.isAvailable;

                return (
                  <tr
                    key={room.id}
                    style={{
                      backgroundColor: !isAvailable
                        ? "#e9ecef"
                        : index % 2 === 0
                        ? "#f8f9fa"
                        : "white",
                      opacity: !isAvailable ? 0.7 : 1,
                    }}
                  >
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{room.name}</td>
                    <td>{room.location}</td>
                    <td>{room.capacity}</td>

                    <td>
                      {isAvailable ? (
                        <span className="text-success fw-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-secondary fw-semibold">
                          Not Available
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {isAvailable ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleBookingClick(room)}
                        >
                          📅 Request Loan
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled
                        >
                          Unavailable
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedRoom && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Loan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Borrower's Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Room Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedRoom.name}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Borrow Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Return Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Purpose of borrowing a room"
                    value={purpose}
                    onChange={(e) =>
                      setPurpose(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleSubmitBooking}
                  disabled={!borrowDate || !returnDate || !purpose}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserRooms;